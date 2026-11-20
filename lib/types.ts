export type PuppyGender = "boy" | "girl" | "boy_and_girl";
export type PuppyLocationType = "dubai_showroom" | "imported";
export type PuppyAvailability = "available" | "gone_home";
export type PublishStatus = "draft" | "published" | "archived";
export type EnquiryStatus =
  | "new"
  | "contacted"
  | "interested"
  | "converted"
  | "closed";
export type EnquirySource = "contact_form" | "puppy_form" | "whatsapp_click";
export type ReviewStatus = "pending" | "approved" | "rejected";
export type MediaType = "image" | "video";

export type PuppyImage = {
  id: string;
  puppy_id: string;
  storage_path: string;
  url: string;
  media_type: MediaType;
  is_featured: boolean;
  sort_order: number;
};

export type Puppy = {
  id: string;
  slug: string;
  name: string;
  breed: string;
  gender: PuppyGender;
  age_label: string;
  description: string;
  location_type: PuppyLocationType;
  availability: PuppyAvailability;
  status: PublishStatus;
  has_video: boolean;
  is_korean_teacup: boolean;
  sort_order: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  puppy_images?: PuppyImage[];
};

export type FamilyImage = {
  id: string;
  family_id: string;
  storage_path: string;
  url: string;
  sort_order: number;
};

export type Family = {
  id: string;
  title: string;
  caption: string;
  adoption_date: string | null;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  family_images?: FamilyImage[];
};

export type Review = {
  id: string;
  family_id: string | null;
  author_name: string;
  author_location: string;
  body: string;
  rating: number;
  status: ReviewStatus;
  show_on_home: boolean;
  created_at: string;
  updated_at: string;
};

export type Enquiry = {
  id: string;
  puppy_id: string | null;
  name: string;
  phone: string;
  email: string | null;
  area: string | null;
  message: string | null;
  source: EnquirySource;
  status: EnquiryStatus;
  internal_notes: string;
  created_at: string;
  updated_at: string;
  puppies?: Pick<Puppy, "id" | "name" | "breed" | "slug"> | null;
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
  is_published: boolean;
  show_on_home: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Admin = {
  id: string;
  auth_user_id: string;
  email: string;
  display_name: string;
};
