import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '10');

    const where = category ? { category } : {};

    const prompts = await prisma.writingPrompt.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      take: Math.min(limit, 50), // Cap at 50
    });

    return NextResponse.json(prompts);
  } catch (error) {
    console.error('Error fetching writing prompts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch writing prompts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { category, promptText, difficultyLevel = 1 } = body;

    if (!category || !promptText) {
      return NextResponse.json(
        { error: 'Category and prompt text are required' },
        { status: 400 }
      );
    }

    const prompt = await prisma.writingPrompt.create({
      data: {
        category,
        promptText,
        difficultyLevel,
      },
    });

    return NextResponse.json(prompt, { status: 201 });
  } catch (error) {
    console.error('Error creating writing prompt:', error);
    return NextResponse.json(
      { error: 'Failed to create writing prompt' },
      { status: 500 }
    );
  }
}