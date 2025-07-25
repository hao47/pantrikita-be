import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import { Prisma, SavedRecipeIngredient } from '@prisma/client';

@Injectable()
export class RecipeService {
    constructor(
        private prisma: PrismaService,
    ) {
    }

    async findAll(userId: string): Promise<any> {


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
                    you_have: ingredients.filter(item => item.is_check == true).map( item => item.name),
                    you_need: ingredients.filter(item => item.is_check == false).map( item => item.name),

                };

            });


            return {
                status: 'Success get Recipes',
                data: formatRecipes,
            };


        } else {


            let formatToarray = pantries.map((item) => {
                return item?.name;
            });

            const filePath = path.join(process.cwd(), 'initial_recipe_suggestion.txt');

            let initialPrompt = await fs.readFileSync(filePath, 'utf-8');

            try {
                const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer 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',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        'model': 'openai/gpt-4o-mini',
                        'messages': [
                            {
                                'role': 'system',
                                'content': initialPrompt,
                            },
                            {
                                'role': 'user',
                                'content': `this the ingredient ${formatToarray}`,
                            },

                        ],
                    }),
                });

                const data = await response.json();
                const jsonString = data['choices'][0]['message']['content'].replace(/```json\n?/, '').replace(/```$/, ''); // misalnya masih berupa string


                const parsed = JSON.parse(jsonString);


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
                    status: 'Success get Recipes',

                    data: formatRecipes,
                };

            } catch (err) {
                console.log(err);
            }

        }

    }




}
