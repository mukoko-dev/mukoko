export interface InterestCategory {
  id: string;
  name: string;
  keywords: string[];
  icon: string;
}

export interface Interest {
  categoryId: string;
  weight: number;
  keywords: string[];
}

export const INTEREST_CATEGORIES = [
  "Technology",
  "Music",
  "Business",
  "Sports",
  "Culture",
  "Food",
  "Politics",
  "Health",
  "Education",
  "Entertainment",
  "Fashion",
  "Art",
  "Science",
  "Religion",
  "Travel",
  "Environment",
  "Agriculture",
  "History",
  "Literature",
  "Photography",
  "Film",
  "Gaming",
  "Parenting",
  "Relationships",
  "Finance",
  "Real Estate",
  "Legal",
  "Automotive",
  "Fitness",
  "Mental Health",
  "Volunteering",
  "Languages",
] as const;
