import * as fs from 'fs';
import * as path from 'path';
import Constants from "../constants";




export const regenerateRecipes = async (formatToarray: string[]) => {

    const filePath = path.join(process.cwd(), 'initial_recipe_regenerate_suggestion.txt');

    let initialPrompt = await fs.readFileSync(filePath, 'utf-8');

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': Constants.Security.OPENROUTER_AI_API,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'model': 'openai/gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: `${initialPrompt}\n\nRandomness Seed: ${Math.floor(Math.random() * 100000)}`
                },
                {
                    role: 'user',
                    content: `this the ingredient ${formatToarray}`,
                },
            ],
        }),
    });



    const data = await response.json();
    const jsonString = data['choices'][0]['message']['content'].replace(/```json\n?/, '').replace(/```$/, ''); // misalnya masih berupa string


   return  JSON.parse(jsonString);
};



export const generateRecipes = async (formatToarray: string[]) => {

    const filePath = path.join(process.cwd(), 'initial_recipe_suggestion.txt');

    let initialPrompt = await fs.readFileSync(filePath, 'utf-8');

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {

            'Authorization': Constants.Security.OPENROUTER_AI_API,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'model': 'openai/gpt-3.5-turbo',
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


    return  JSON.parse(jsonString);
};



export const generateDetailPantry = async (inputItem: string) => {

    const filePath = path.join(process.cwd(), 'initial_pantry_prompt.txt');


    let initialPrompt = await fs.readFileSync(filePath, 'utf-8');



    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': Constants.Security.OPENROUTER_AI_API,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'model': 'openai/gpt-3.5-turbo',
            'messages': [
                {
                    'role': 'system',
                    'content': initialPrompt,
                },
                {
                    'role': 'user',
                    'content': inputItem,
                },

            ],
        }),
    });

    const data = await response.json();
    const jsonString = data['choices'][0]['message']['content'].replace(/```json\n?/, '').replace(/```$/, ''); // misalnya masih berupa string


    return  JSON.parse(jsonString);
};