import {
    Body,
    Controller,
    Post,
    HttpCode,
    HttpStatus,
    Get,
    UseGuards,
    Request,
    Patch,
    Put, Res, Query, UseInterceptors, UploadedFile, BadRequestException,
} from '@nestjs/common';
import { ScanService } from './scan.service';

import { AuthGuard } from '../auth/auth.guard';
import {ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation} from '@nestjs/swagger';
import {ScanRequestDto} from "./dto/create-scan.dto";
import path, {extname} from "path";
import fs from "fs";
import {FileInterceptor} from "@nestjs/platform-express";
import {diskStorage} from "multer";
import Constants from "../../constants";


@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('scan')
export class ScanController {
    constructor(private scanService: ScanService) {}



    @Post()
    create(@Request() request: any,@Body() scanRequestDto: ScanRequestDto ): Promise<any>  {
        const userId: string = request.user.sub.id;

        return this.scanService.create(scanRequestDto,userId);
    }


    @Post('identify')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: (req, file, cb) => {
                    cb(null, './uploads');
                },
                filename: (req, file, cb) => {
                    const randomName = Date.now() + '_' + Math.round(Math.random() * 1E9) + extname(file.originalname);
                    cb(null, randomName);
                },
            }),
            limits: {
                fileSize: 5 * 1024 * 1024, // 5MB limit
            },
            fileFilter: (req, file, cb) => {
                // Check file type
                if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
                    return cb(new BadRequestException('Only image files are allowed!'), false);
                }
                cb(null, true);
            }
        }),
    )
    async scanIdentifyImage(@UploadedFile() file: Express.Multer.File) {
        try {
            if (!file) {
                throw new BadRequestException('No file uploaded');
            }

            console.log('Uploaded file:', file);

            // Process image with OpenRouter API
            const extractedData = await this.processImageWithOpenRouter(file);

            return {
                message: 'Image processed successfully',
                data: extractedData
            };
        } catch (error) {
            console.error('Upload error:', error);
            throw error;
        }
    }

    private async processImageWithOpenRouter(file: Express.Multer.File) {
        try {
            // Read the image file and convert to base64
            const fs = require('fs');
            const path = require('path');

            const imageBuffer = fs.readFileSync(file.path);
            const base64Image = imageBuffer.toString('base64');

            // Determine image type from file extension
            const imageType = path.extname(file.originalname).toLowerCase().replace('.', '');
            const mimeType = `image/${imageType === 'jpg' ? 'jpeg' : imageType}`;

            const today = new Date();
            const day = String(today.getDate()).padStart(2, '0');
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const year = today.getFullYear();
            const todayStr = `${day}-${month}-${year}`;

            const prompt = `
      Assume today's date is ${todayStr}.

Analyze the image of a food item and extract the following information in **valid JSON only**:

{
  "name": "name of the food item (based on packaging or visual)",
  "category": "one of: fruit, vegetable, meat, dairy, grains, seafood",
  "expiring_date": "estimated expiration date in yyyy/MM/dd format",
  "location": "suggested storage location (e.g., Refrigerator, Pantry, Freezer)"
}

If the packaging shows an expiration or best-before date, use it directly.

If no expiration date is visible, estimate it using:
- the food category,
- the number of days since it was purchased: \`purchased_days_ago = X\`,

If the item looks processed (e.g., frozen, smoked, canned), adjust the shelf life accordingly.

Only output the final JSON result — no explanation or extra commentary.
`;

            const requestBody = {
                model: 'openai/gpt-4o-mini',
                messages: [
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'text',
                                text: prompt
                            },
                            {
                                type: 'image_url',
                                image_url: {
                                    url: `data:${mimeType};base64,${base64Image}`
                                }
                            }
                        ]
                    }
                ],
                max_tokens: 500,
                temperature: 0.1
            };

            const openRouterUrl = 'https://openrouter.ai/api/v1/chat/completions';

            const response = await fetch(openRouterUrl, {
                method: 'POST',
                headers: {
                    'Authorization': Constants.Security.OPENROUTER_AI_API,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
            }

            const responseData = await response.json();
            const content = responseData.choices?.[0]?.message?.content.replace(/```json\n?/, '').replace(/```$/, '');;

            if (!content) {
                throw new Error('No response content from OpenRouter API');
            }

            // Parse the JSON response
            const extractedData = JSON.parse(content);

            return extractedData;

        } catch (error) {
            console.error('Error processing image with OpenRouter:', error);
            throw new BadRequestException('Failed to process image with AI');
        }
    }





}
