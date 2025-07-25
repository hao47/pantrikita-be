-- DropForeignKey
ALTER TABLE "SavedRecipe" DROP CONSTRAINT "SavedRecipe_user_id_fkey";

-- DropForeignKey
ALTER TABLE "SavedRecipeIngredient" DROP CONSTRAINT "SavedRecipeIngredient_saved_recipe_id_fkey";

-- DropForeignKey
ALTER TABLE "SavedRecipeInstruction" DROP CONSTRAINT "SavedRecipeInstruction_saved_recipe_id_fkey";

-- AlterTable
ALTER TABLE "SavedRecipeIngredient" ADD COLUMN     "user_id" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "SavedRecipeInstruction" ADD COLUMN     "user_id" TEXT NOT NULL DEFAULT '';

-- AddForeignKey
ALTER TABLE "SavedRecipe" ADD CONSTRAINT "SavedRecipe_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedRecipeIngredient" ADD CONSTRAINT "SavedRecipeIngredient_saved_recipe_id_fkey" FOREIGN KEY ("saved_recipe_id") REFERENCES "SavedRecipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedRecipeIngredient" ADD CONSTRAINT "SavedRecipeIngredient_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedRecipeInstruction" ADD CONSTRAINT "SavedRecipeInstruction_saved_recipe_id_fkey" FOREIGN KEY ("saved_recipe_id") REFERENCES "SavedRecipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedRecipeInstruction" ADD CONSTRAINT "SavedRecipeInstruction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
