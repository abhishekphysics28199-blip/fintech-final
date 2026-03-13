from deep_translator import GoogleTranslator

LANGUAGE_CODES = {
    "English": "en",
    "हिन्दी": "hi",
    "தமிழ்": "ta",
    "తెలుగు": "te",
    "ಕನ್ನಡ": "kn",
    "मराठी": "mr",
    "বাংলা": "bn",
    "ગુજરાતી": "gu",
    "ਪੰਜਾਬੀ": "pa",
    "ଓଡ଼ିଆ": "or",
    "മലയാളം": "ml",
    "অসমীয়া": "as",
    "मैथिली": "mai",
    "नेपाली": "ne",
    "सिन्धी": "sd",
    "कोंकणी": "kok",
    "डोगरी": "doi",
    "বোড়ো": "brx",
    "সাঁওতালি": "sat",
    "কাশ্মীরি": "ks",
    "मणिपुरी": "mni",
    "संस्कृत": "sa",
}


def translate_response(text: str, target_language_code: str) -> str:
    if not text:
        return text
    if target_language_code == "en":
        return text
    translator = GoogleTranslator(source="en", target=target_language_code)
    return translator.translate(text)

