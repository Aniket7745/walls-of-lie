// src/app/api/stories/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Story from '@/models/story';

// GET: Fetch all stories
export async function GET() {
  try {
    // Connect to the database
    await dbConnect();
    // Query the stories collection
    const stories = await Story.find().sort({ createdAt: -1 });
    // Return the stories in JSON format
    return NextResponse.json(stories, { status: 200 });
  } catch (error) {
    console.error('GET /api/stories error:', error);
    return NextResponse.json({ error: 'Error fetching stories' }, { status: 500 });
  }
}

// POST: Create a new story
export async function POST(request: Request) {
  try {
    // Connect to the database
    await dbConnect();
    // Parse the JSON body
    const body = await request.json();
    // Create a new Story document
    const newStory = await Story.create(body);
    // Return the newly created story
    return NextResponse.json(newStory, { status: 201 });
  } catch (error) {
    console.error('POST /api/stories error:', error);
    return NextResponse.json({ error: 'Error saving story' }, { status: 500 });
  }
}
