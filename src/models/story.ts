// src/models/Story.ts
import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IStory extends Document {
  content: string;
  author: string;
  title?: string;
  createdAt: Date;
}

const StorySchema: Schema<IStory> = new Schema<IStory>({
  content: { type: String, required: true },
  author: { type: String, required: true },
  title: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Pre-validation hook
StorySchema.pre<IStory>('validate', function (next) {
  if (!this.title && this.content) {
    const fallback = this.content.substring(0, 30);
    this.title = fallback + (this.content.length > 30 ? '...' : '');
  }
  next();
});

const Story: Model<IStory> =
  mongoose.models.Story || mongoose.model<IStory>('Story', StorySchema);

export default Story;
