import {Injectable, UnprocessableEntityException} from '@nestjs/common';
import {PrismaService} from '../../prisma/prisma.service';
import {Prisma, SavedRecipeIngredient} from '@prisma/client';
import {CommonResponseDto} from "../../dtos/common-response-dto";
import {generateRecipes, regenerateRecipes} from "../../helper/ai-api-to-json";

@Injectable()
export class RecipeService {
    constructor(
        private prisma: PrismaService,
    ) {
    }

    async findAll(userId: string): Promise<CommonResponseDto> {


        const [pantries, recipes, totalRecipes] = await Promise.all([
            this.prisma.item.findMany({
                where: {
                    user_id: userId,
                },
                select: {
                    name: true,
                },
            }),

            this.prisma.savedRecipe.findMany({
                where: {
                    user_id: userId,
                },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    difficulty: true,
                    cultural_heritage: true,
                    location: true,
                    cook_time: true,
                    servings_portion: true,
                    ingredients: {
                        select: {
                            name: true,
                            is_check: true,
                        },
                    },

                },

            }),

            this.prisma.savedRecipe.count(),

        ]);


        if (totalRecipes > 0) {

            const formatRecipes = recipes.map((item) => {

                const ingredients = item.ingredients;

                return {
                    id: item.id,
                    title: item.title,
                    description: item.description,
                    difficulty: item.difficulty,
                    cultural_heritage: item.cultural_heritage,
                    location: item.location,
                    cook_time: item.cook_time,
                    servings_portion: item.servings_portion,
                    you_have: ingredients.filter(item => item.is_check == true).map(item => item.name),
                    you_need: ingredients.filter(item => item.is_check == false).map(item => item.name),

                };

            });


            return {
                message: 'Success get Recipes',
                data: formatRecipes,
            };


        } else {


            let formatToarray = pantries.map((item) => {
                return item?.name;
            });


            const parsed = await generateRecipes(formatToarray)



            for (let i = 0; i < Number(parsed["recipes"].length); i++) {
                try {
                    await this.prisma.$transaction(async (prisma) => {

                        const save_recipe_id = await this.prisma.savedRecipe.create({
                            data: {
                                title: parsed['recipes'][i]['title'],
                                location: parsed['recipes'][i]['region'],
                                cook_time: parsed['recipes'][i]['time'],
                                cultural_heritage: parsed['recipes'][i]['culturalHeritage'],
                                description: parsed['recipes'][i]['description'],
                                servings_portion: parsed['recipes'][i]['servings'],
                                difficulty: parsed['recipes'][i]['difficulty'],
                                user: {
                                    connect: {
                                        id: userId,
                                    },
                                },
                            },
                        });


                        for (let j = 0; j < parsed["recipes"][i]["steps"].length; j++) {
                            await this.prisma.savedRecipeInstruction.create({
                                data: {
                                    instruction: parsed['recipes'][i]['steps'][j],
                                    saved_recipe: {
                                        connect: {
                                            id: save_recipe_id.id,
                                        },
                                    },
                                    user: {
                                        connect: {
                                            id: userId,
                                        },
                                    },
                                },
                            });
                        }

                        const format_you_have = parsed['recipes'][i]['youHave'].map((item) => {

                            return {
                                content: item,
                                is_check: true,
                            };
                        });
                        const format_you_need = parsed['recipes'][i]['youNeed'].map((item) => {
                            return {
                                content: item,
                                is_check: false,
                            };
                        });


                        const concatArray = format_you_have.concat(format_you_need);


                        for (let j = 0; j < concatArray.length; j++) {
                            await this.prisma.savedRecipeIngredient.create({
                                data: {
                                    name: concatArray[j].content,
                                    is_check: concatArray[j].is_check,
                                    saved_recipe: {
                                        connect: {
                                            id: save_recipe_id.id,
                                        },
                                    },
                                    user: {
                                        connect: {
                                            id: userId,
                                        },
                                    },
                                },
                            });
                        }

                    });
                } catch (e) {
                    if (e instanceof Prisma.PrismaClientKnownRequestError) {

                        if (e.code === 'P2002') {
                            throw new UnprocessableEntityException('Nama Anak already exist');
                        } else if (e.code === 'P3000') {
                            throw new UnprocessableEntityException('failed to create Anak');
                        } else if (e.code === 'P2025') {
                            throw new UnprocessableEntityException('Tidak ada Orangtua yang terkait sesuai dengan Id');
                        }
                    }
                    throw e;
                }
            }

            const recipes = await this.prisma.savedRecipe.findMany({
                where: {
                    user_id: userId,
                },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    difficulty: true,
                    cultural_heritage: true,
                    location: true,
                    cook_time: true,
                    servings_portion: true,
                    ingredients: {
                        select: {
                            name: true,
                            is_check: true,
                        },
                    },

                },

            });


            const formatRecipes = recipes.map((item) => {

                const ingredients = item.ingredients;

                return {
                    id: item.id,
                    title: item.title,
                    description: item.description,
                    difficulty: item.difficulty,
                    cultural_heritage: item.cultural_heritage,
                    location: item.location,
                    cook_time: item.cook_time,
                    servings_portion: item.servings_portion,
                    you_have: ingredients.filter(item => item.is_check == true),
                    you_need: ingredients.filter(item => item.is_check == false),

                };

            });


            return {
                message: 'Success get Recipes',

                data: formatRecipes,
            };

        }


    }


    async regenerate(userId: string): Promise<CommonResponseDto> {


        const [pantries,] = await Promise.all([
            this.prisma.item.findMany({
                where: {
                    user_id: userId,
                },
                select: {
                    name: true,
                },
            }),


        ]);



        let formatToarray = pantries.map((item) => {
            return item?.name;
        });

        const parsed = await regenerateRecipes(formatToarray)




        await this.prisma.savedRecipeInstruction.deleteMany({
            where: {
                user_id: userId,
            },
        });

        await this.prisma.savedRecipeIngredient.deleteMany({
            where: {
                user_id: userId,
            },
        });

        await this.prisma.savedRecipe.deleteMany({
            where: {
                user_id: userId,
            },
        });



        for (let i = 0; i < Number(parsed["recipes"].length); i++) {
                try {
                    await this.prisma.$transaction(async (prisma) => {

                        const save_recipe_id = await this.prisma.savedRecipe.create({
                            data: {
                                title: parsed['recipes'][i]['title'],
                                location: parsed['recipes'][i]['region'],
                                cook_time: parsed['recipes'][i]['time'],
                                cultural_heritage: parsed['recipes'][i]['culturalHeritage'],
                                description: parsed['recipes'][i]['description'],
                                servings_portion: parsed['recipes'][i]['servings'],
                                difficulty: parsed['recipes'][i]['difficulty'],
                                user: {
                                    connect: {
                                        id: userId,
                                    },
                                },
                            },
                        });


                        for (let j = 0; j < parsed["recipes"][i]["steps"].length; j++) {
                            await this.prisma.savedRecipeInstruction.create({
                                data: {
                                    instruction: parsed['recipes'][i]['steps'][j],
                                    saved_recipe: {
                                        connect: {
                                            id: save_recipe_id.id,
                                        },
                                    },
                                    user: {
                                        connect: {
                                            id: userId,
                                        },
                                    },


                                },
                            });
                        }

                        const format_you_have = parsed['recipes'][i]['youHave'].map((item) => {

                            return {
                                content: item,
                                is_check: true,
                            };
                        });
                        const format_you_need = parsed['recipes'][i]['youNeed'].map((item) => {
                            return {
                                content: item,
                                is_check: false,
                            };
                        });


                        const concatArray = format_you_have.concat(format_you_need);


                        for (let j = 0; j < concatArray.length; j++) {
                            await this.prisma.savedRecipeIngredient.create({
                                data: {
                                    name: concatArray[j].content,
                                    is_check: concatArray[j].is_check,
                                    saved_recipe: {
                                        connect: {
                                            id: save_recipe_id.id,
                                        },
                                    },
                                    user: {
                                        connect: {
                                            id: userId,
                                        },
                                    },
                                },
                            });
                        }

                    });
                } catch (e) {
                    if (e instanceof Prisma.PrismaClientKnownRequestError) {

                        if (e.code === 'P2002') {
                            throw new UnprocessableEntityException('Nama Anak already exist');
                        } else if (e.code === 'P3000') {
                            throw new UnprocessableEntityException('failed to create Anak');
                        } else if (e.code === 'P2025') {
                            throw new UnprocessableEntityException('Tidak ada Orangtua yang terkait sesuai dengan Id');
                        }
                    }
                    throw e;
                }
            }

            const recipes = await this.prisma.savedRecipe.findMany({
                where: {
                    user_id: userId,
                },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    difficulty: true,
                    cultural_heritage: true,
                    location: true,
                    cook_time: true,
                    servings_portion: true,
                    ingredients: {
                        select: {
                            name: true,
                            is_check: true,
                        },
                    },

                },

            });


            const formatRecipes = recipes.map((item) => {

                const ingredients = item.ingredients;

                return {
                    id: item.id,
                    title: item.title,
                    description: item.description,
                    difficulty: item.difficulty,
                    cultural_heritage: item.cultural_heritage,
                    location: item.location,
                    cook_time: item.cook_time,
                    servings_portion: item.servings_portion,
                    you_have: ingredients.filter(item => item.is_check == true),
                    you_need: ingredients.filter(item => item.is_check == false),

                };

            });


            return {
                message: 'Success regenerate',
                data: formatRecipes,
            };




    }


    async findId(id: string): Promise<CommonResponseDto> {

        const [recipe] = await Promise.all([
            this.prisma.savedRecipe.findUnique({
                where: {
                    id: id.toString(),
                },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    difficulty: true,
                    cultural_heritage: true,
                    location: true,
                    cook_time: true,
                    servings_portion: true,
                    ingredients: {
                        select: {
                            id:true,
                            name: true,
                            is_check: true,
                        },
                    },
                    instructions: {
                        select: {
                            instruction: true,
                        },
                    },
                },
            }),
        ]);

        const formatRecipeDetail = {
            id: recipe?.id,
            title: recipe?.title,
            description: recipe?.description,
            difficulty: recipe?.difficulty,
            cultural_heritage: recipe?.cultural_heritage,
            location: recipe?.location,
            cook_time: recipe?.cook_time,
            servings_portion: recipe?.servings_portion,
            ingredients: recipe?.ingredients,
            instructions: recipe?.instructions.map(item => item.instruction),
        }


        return {
            message: 'Success get Recipe Detail',
            data: formatRecipeDetail,
        };

    }


}
