export type AdStatusType = "PENDING" | "ACTIVATED" | "REJECTED" | "SUSPENDED";

export type AnnouncementType = {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  subCategory: string;
  city: string;
  phoneNumber: string;
  whatsappNumber: string;
  userId: string;
  conditions: string[];
  options: {
    label: string;
    active: boolean;
  }[];
  images: string[];
  stats: {
    clicks: number;
    favorites: number;
    views: number;
  };
  status: AdStatusType;
  reportCount?: number;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  updatedAt: {
    _seconds: number;
    _nanoseconds: number;
  };
};

export type AuthMethodType = "EMAIL_PASSWORD" | "PHONE_NUMBER" | "GOOGLE";

export type UserType = {
  id: string;
  userName: string;
  firstAndLastName: string;
  gender: "MAN" | "WOMAN";
  dateOfBirth: {
    _seconds: number;
    _nanoseconds: number;
  };
  image: string;
  location: {
    city: string;
    country: string;
  };
  phoneNumber: string;
  whatsappNumber: string;
  email: string;
  authMethod: AuthMethodType;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  updatedAt: {
    _seconds: number;
    _nanoseconds: number;
  };
};

export type NotificationType = {
  id: string;
  title: string;
  body: string;
  type: "USER_NOTIFICATION" | "GENERAL_NOTIFICATION";
  userId?: string;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  updatedAt: {
    _seconds: number;
    _nanoseconds: number;
  };
};

export type ReportType = {
  id: string;
  userId: string;
  adId: string;
  count: number;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
  updatedAt: {
    _seconds: number;
    _nanoseconds: number;
  };
};
