export type LanguageOption = { label: string; code: string };

export const LANGUAGES: LanguageOption[] = [
  { label: "English", code: "en" },
  { label: "हिन्दी", code: "hi" },
  { label: "தமிழ்", code: "ta" },
  { label: "తెలుగు", code: "te" },
  { label: "ಕನ್ನಡ", code: "kn" },
  { label: "मराठी", code: "mr" },
  { label: "বাংলা", code: "bn" },
  { label: "ગુજરાતી", code: "gu" },
  { label: "ਪੰਜਾਬੀ", code: "pa" },
  { label: "ଓଡ଼ିଆ", code: "or" },
  { label: "മലയാളം", code: "ml" },
  { label: "অসমীয়া", code: "as" },
  { label: "मैथिली", code: "mai" },
  { label: "संस्कृत", code: "sa" },
  { label: "नेपाली", code: "ne" },
  { label: "सिन्धी", code: "sd" },
  { label: "कोंकणी", code: "kok" },
  { label: "डोगरी", code: "doi" },
  { label: "বোড়ো", code: "brx" },
  { label: "সাঁওতালি", code: "sat" },
  { label: "কাশ্মীরি", code: "ks" },
  { label: "মণিপুরি", code: "mni" }
];

export const DEFAULT_LANGUAGE = LANGUAGES[0];

export const STORAGE_KEYS = {
  languageCode: "fintech_ai_language_code",
  languageLabel: "fintech_ai_language_label",
  authToken: "fintech_ai_token",
} as const;

