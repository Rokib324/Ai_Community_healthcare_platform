import React, { createContext, useContext, useState } from 'react';

export type Language = 'en' | 'bn';
export type TextSize = 'normal' | 'large';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
  lowBandwidth: boolean;
  setLowBandwidth: (enabled: boolean) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Brand
    brand_name: 'CommHealth AI',
    brand_tagline: 'Rural Healthcare Bridge',
    
    // Navbar
    nav_home: 'Home',
    nav_find_doctor: 'Find a Doctor',
    nav_telemedicine: 'Telemedicine',
    nav_ai_tools: 'AI Tools',
    nav_patient_portal: 'Patient Portal',
    nav_emergency_help: 'Get Medical Help Now',
    nav_sign_in: 'Sign In',
    nav_sign_up: 'Register',
    nav_log_out: 'Log out',
    nav_text_size: 'Text Size',
    
    // Hero
    hero_badge: 'Trusted Rural Healthcare & AI Innovation',
    hero_headline: 'Smart Healthcare, Closer to Your Home.',
    hero_subheadline: 'Access expert doctors, book instant appointments, and get AI-powered health insights—designed specifically for rural and underserved communities.',
    hero_cta_doctor: 'Find a Nearby Doctor',
    hero_cta_telemedicine: 'Start Telemedicine Consultation',
    hero_trust_badge_1: '24/7 Verified Doctors',
    hero_trust_badge_2: 'Low-Bandwidth Enabled',
    hero_trust_badge_3: 'Free AI Symptom Check',
    hero_emergency_banner: '24/7 Emergency Medical Hotline: 16263 (National Health Service)',

    // Quick Action Hub
    hub_title: 'Quick Care Hub',
    hub_subtitle: 'One-touch healthcare access designed for rapid assistance without complicated steps',
    hub_find_doctor_title: 'Find a Doctor',
    hub_find_doctor_desc: 'Search verified doctors by upazila/district, specialty, and real-time availability.',
    hub_telemedicine_title: 'Video Consult (Telemedicine)',
    hub_telemedicine_desc: 'Connect live with digital healthcare providers directly over secure video or phone.',
    hub_appointment_title: 'Book Appointment',
    hub_appointment_desc: 'Secure online scheduling with community healthcare clinics and specialists.',
    hub_records_title: 'My Medical Records',
    hub_records_desc: 'Access and securely manage your electronic prescriptions and test reports.',
    hub_reminders_title: 'Medicine Reminders',
    hub_reminders_desc: 'Set up automated SMS and app reminders so you never miss a dose.',
    hub_emergency_title: 'Emergency Helpline',
    hub_emergency_desc: 'Instant 24/7 dispatch connection to local ambulances and critical care centers.',

    // AI Suite
    ai_suite_badge: 'Cutting-Edge Machine Learning Built For Communities',
    ai_suite_title: 'Featured Intelligent AI Suite',
    ai_suite_subtitle: 'Powerful clinical machine learning models simplified to bring hospital-grade clarity to your fingertips.',
    
    ai_summarizer_title: 'AI Medical Report Summarizer',
    ai_summarizer_desc: 'Upload your medical report and get a simplified, jargon-free explanation instantly.',
    ai_summarizer_btn: 'Upload & Summarize Lab Report',
    ai_summarizer_sample_tag: 'Interactive Demonstration',
    ai_summarizer_complex_title: 'Standard Lab Report (Complex Jargon)',
    ai_summarizer_complex_line1: 'Fasting Blood Glucose: 138 mg/dL (Reference: 70-99)',
    ai_summarizer_complex_line2: 'HbA1c: 6.8% (Glycated Hemoglobin elevated)',
    ai_summarizer_complex_line3: 'Serum Creatinine: 1.1 mg/dL (eGFR: 84 mL/min)',
    ai_summarizer_simple_title: 'CommHealth AI Patient Checklist',
    ai_summarizer_simple_item1: 'Blood Sugar is mildly high: Eat smaller carbohydrate portions and avoid sweetened tea.',
    ai_summarizer_simple_item2: 'Kidney markers are healthy: Maintain good daily hydration (2-3 liters of water).',
    ai_summarizer_simple_item3: 'Recommended action: Schedule a routine consultation with a general physician within 2 weeks.',

    ai_risk_title: 'Machine Learning Disease Risk Predictor',
    ai_risk_desc: 'Take our smart health assessment to evaluate cardiovascular and chronic disease risks early.',
    ai_risk_btn: 'Take Health Risk Assessment',
    ai_risk_score_label: 'Calculated Community Health Index',
    ai_risk_score_status: 'Low to Moderate Risk',
    ai_risk_score_caption: 'Friendly, non-alarmist early detection assessment based on lifestyle, blood pressure, and symptom trends.',
    ai_risk_card_bp: 'Blood Pressure: 122/80 mmHg (Optimal)',
    ai_risk_card_heart: 'Resting Pulse: 72 bpm (Normal rhythm)',
    ai_risk_card_lifestyle: 'Daily Activity: 35 mins walking detected',

    // Trust & Statistics
    stats_badge: 'Bridging the Healthcare Divide',
    stats_title: 'Measurable Impact Where It Matters Most',
    stats_stat1_number: '10,000+',
    stats_stat1_label: 'Rural citizens supported per available local doctor—we bridge this gap.',
    stats_stat2_number: '86%',
    stats_stat2_label: 'Of users find telemedicine to be a cost-effective, life-saving alternative.',
    stats_stat3_number: '10 Mins',
    stats_stat3_label: 'Average time to access a remote specialist through our portal.',
    stats_stat4_number: '24/7',
    stats_stat4_label: 'Round-the-clock emergency triage support with low-bandwidth optimization.',

    // How It Works
    how_badge: 'Simple 3-Step Process',
    how_title: 'How It Works for Every Citizen',
    how_subtitle: 'Designed specifically for non-tech-savvy users and elderly family members with minimal steps.',
    how_step1_number: '01',
    how_step1_title: 'Create a Profile',
    how_step1_desc: 'Sign up securely in 30 seconds with your mobile number or national ID card. No complex paperwork required.',
    how_step2_number: '02',
    how_step2_title: 'Choose a Service',
    how_step2_desc: 'Consult an AI tool for immediate insights, find a local verified clinic, or book an instant live video call.',
    how_step3_number: '03',
    how_step3_title: 'Receive Care',
    how_step3_desc: 'Get your digital prescription, plain-language summary, and automated medicine tracking alerts straight to your phone.',

    // Testimonial / Story Callout
    trust_callout_quote: '"During flooding season in our village, roads were submerged. Through this platform, my mother consulted an expert doctor within 15 minutes, and we understood her blood report without traveling 40 miles."',
    trust_callout_author: '— Rafiqul Islam, Community Health Volunteer, Rangpur',

    // Footer
    footer_tagline: 'Bridging high-tech artificial intelligence with compassionate community healthcare for every rural family.',
    footer_quick_links: 'Quick Links',
    footer_about: 'About Us',
    footer_privacy: 'Privacy Policy',
    footer_terms: 'Terms of Service',
    footer_support: 'Support & Help Center',
    footer_contact_title: 'Emergency & Community Contact',
    footer_helpline_label: '24/7 National Health Helpline',
    footer_phone: '+880 16263 / +880 9612-HEALTH',
    footer_email: 'care@commhealth.ai',
    footer_location: 'Rural Health Mission Hub, Dhaka & Regional Upazila Centers',
    footer_emergency_disclaimer_title: 'Critical Emergency Notice',
    footer_emergency_disclaimer: 'If you are experiencing a severe medical emergency (such as severe chest pain, breathing difficulty, or uncontrolled bleeding), please visit the nearest hospital emergency room or call 999 immediately. This service complements, but does not replace, emergency hospitalization.',
    footer_copyright: 'All rights reserved. Dedicated to rural and underserved communities.'
  },
  bn: {
    // Brand
    brand_name: 'কমিউনিটি হেলথ এআই',
    brand_tagline: 'গ্রামীণ স্বাস্থ্যসেবা সেতু',

    // Navbar
    nav_home: 'হোম',
    nav_find_doctor: 'ডাক্তার খুঁজুন',
    nav_telemedicine: 'টেলিমেডিসিন',
    nav_ai_tools: 'এআই টুলস',
    nav_patient_portal: 'রোগীর পোর্টাল',
    nav_emergency_help: 'জরুরি চিকিৎসা সহায়তা নিন',
    nav_sign_in: 'লগইন',
    nav_sign_up: 'নিবন্ধন',
    nav_log_out: 'লগআউট',
    nav_text_size: 'ফন্ট সাইজ',

    // Hero
    hero_badge: 'গ্রামীণ স্বাস্থ্যসেবায় নির্ভরযোগ্য এআই উদ্ভাবন',
    hero_headline: 'স্মার্ট স্বাস্থ্যসেবা, আপনার ঘরের দোরগোড়ায়।',
    hero_subheadline: 'অভিজ্ঞ চিকিৎসকের পরামর্শ নিন, দ্রুত অ্যাপয়েন্টমেন্ট বুক করুন এবং এআই প্রযুক্তির স্বাস্থ্য সহায়তা পান—বিশেষত গ্রামীণ ও সুবিধাবঞ্চিত মানুষের জন্য।',
    hero_cta_doctor: 'নিকটস্থ ডাক্তার খুঁজুন',
    hero_cta_telemedicine: 'টেলিমেডিসিন পরামর্শ শুরু করুন',
    hero_trust_badge_1: '২৪/৭ নিবন্ধিত ডাক্তার',
    hero_trust_badge_2: 'ধীরগতির ইন্টারনেটেও সচল',
    hero_trust_badge_3: 'বিনামূল্যে এআই লক্ষণ পরীক্ষা',
    hero_emergency_banner: '২৪/৭ জরুরি স্বাস্থ্যসেবা হটলাইন: ১৬২৬৩ (স্বাস্থ্য বাতায়ন)',

    // Quick Action Hub
    hub_title: 'দ্রুত সেবা হাব (Quick Action Hub)',
    hub_subtitle: 'গ্রামীণ মানুষের সুবিধার্থে এক ক্লিকেই প্রয়োজনীয় সব চিকিৎসা সেবা',
    hub_find_doctor_title: 'ডাক্তার খুঁজুন',
    hub_find_doctor_desc: 'উপজেলা ও জেলাভিত্তিক বিশেষজ্ঞ ডাক্তার ও চেম্বারের সময়সূচী জানুন।',
    hub_telemedicine_title: 'ভিডিও কনসাল্ট (টেলিমেডিসিন)',
    hub_telemedicine_desc: 'মোবাইলের মাধ্যমে সরাসরি বিশেষজ্ঞ ডাক্তারের সাথে ভিডিও বা অডিও কলে কথা বলুন।',
    hub_appointment_title: 'অ্যাপয়েন্টমেন্ট বুক করুন',
    hub_appointment_desc: 'হাসপাতাল বা স্থানীয় ক্লিনিকের জন্য ঝামেলাহীন অগ্রিম সিরিয়াল নিন।',
    hub_records_title: 'আমার প্রেসক্রিপশন ও রিপোর্ট',
    hub_records_desc: 'আপনার সকল প্রেসক্রিপশন ও ল্যাব টেস্টের রিপোর্ট নিরাপদে সংরক্ষণ করুন।',
    hub_reminders_title: 'ওষুধের অ্যালার্ম ও রিমাইন্ডার',
    hub_reminders_desc: 'মোবাইলে এসএমএস ও অ্যালার্মের মাধ্যমে নিয়মিত ওষুধ সেবনের বার্তা পান।',
    hub_emergency_title: 'জরুরি অ্যাম্বুলেন্স ও হেল্পলাইন',
    hub_emergency_desc: 'জরুরি পরিস্থিতিতে দ্রুত অ্যাম্বুলেন্স সেবা ও স্বাস্থ্য বাতায়নে যোগাযোগ করুন।',

    // AI Suite
    ai_suite_badge: 'উন্নত কৃত্রিম বুদ্ধিমত্তা (AI) এখন বাংলায়',
    ai_suite_title: 'বিশেষায়িত ইন্টেলিজেন্ট এআই স্যুট',
    ai_suite_subtitle: 'জটিল ডাক্তারি পরিভাষা সহজ বাংলায় বুঝে নিন এবং রোগের ঝুঁকি আগেভাগেই শনাক্ত করুন।',

    ai_summarizer_title: 'এআই মেডিকেল রিপোর্ট সামারাইজার',
    ai_summarizer_desc: 'আপনার প্রেসক্রিপশন বা ল্যাব রিপোর্ট আপলোড করে নিমেষেই সহজ সরল বাংলায় সারসংক্ষেপ পান।',
    ai_summarizer_btn: 'রিপোর্ট আপলোড ও বিশ্লেষণ করুন',
    ai_summarizer_sample_tag: 'ডেমো উদাহরণ',
    ai_summarizer_complex_title: 'জটিল ল্যাব রিপোর্ট (হাসপাতাল সংস্করণ)',
    ai_summarizer_complex_line1: 'Fasting Blood Glucose: 138 mg/dL (উচ্চ মাত্রা)',
    ai_summarizer_complex_line2: 'HbA1c: 6.8% (রক্তে সুগারের গড় মাত্রা বেশি)',
    ai_summarizer_complex_line3: 'Serum Creatinine: 1.1 mg/dL (স্বাভাবিক সীমার মধ্যে)',
    ai_summarizer_simple_title: 'কমিউনিটি এআই সহজ পরামর্শ চেকলিস্ট',
    ai_summarizer_simple_item1: 'রক্তের সুগার সামান্য বেশি: মিষ্টি চা ও অতিরিক্ত ভাত পরিহার করুন।',
    ai_summarizer_simple_item2: 'কিডনির কার্যক্রম সম্পূর্ণ ভালো: দৈনিক পর্যাপ্ত পানি (৮-১০ গ্লাস) পান করুন।',
    ai_summarizer_simple_item3: 'পরামর্শ: আগামী ২ সপ্তাহের মধ্যে স্থানীয় স্বাস্থ্য কমপ্লেক্সে সাধারণ চিকিৎসকের সাথে দেখা করুন।',

    ai_risk_title: 'মেশিন লার্নিং রোগ ঝুঁকি পূর্বানুমান',
    ai_risk_desc: 'আমাদের স্মার্ট স্বাস্থ্য মূল্যায়নের মাধ্যমে হৃদরোগ ও দীর্ঘমেয়াদী রোগের প্রাথমিক ঝুঁকি নির্ণয় করুন।',
    ai_risk_btn: 'স্বাস্থ্য ঝুঁকি পরীক্ষা শুরু করুন',
    ai_risk_score_label: 'গণনাকৃত স্বাস্থ্য সুস্থতা সূচক',
    ai_risk_score_status: 'স্বাভাবিক ও নিরাপদ মাত্রা',
    ai_risk_score_caption: 'ভীতিহীন, বন্ধুত্বপূর্ণ স্বাস্থ্য মূল্যায়ন যা আপনার জীবনযাত্রা ও লক্ষণ অনুযায়ী সঠিক পরামর্শ দেয়।',
    ai_risk_card_bp: 'রক্তচাপ: ১২২/৮০ mmHg (চমৎকার)',
    ai_risk_card_heart: 'হৃদস্পন্দন: ৭২ bpm (নিয়মিত)',
    ai_risk_card_lifestyle: 'শারীরিক পরিশ্রম: দৈনিক ৩৫ মিনিট হাঁটা নিশ্চিত',

    // Trust & Statistics
    stats_badge: 'চিকিৎসা বৈষম্য দূরীকরণে আমরা প্রতিশ্রুতিবদ্ধ',
    stats_title: 'প্রয়োজনের মুহূর্তে বিশ্বস্ত সেবা',
    stats_stat1_number: '১০,০০০+',
    stats_stat1_label: 'প্রতিটি গ্রামীণ ডাক্তারের বিপরীতে জনসংখ্যা—আমরা এই দূরত্ব দূর করি।',
    stats_stat2_number: '৮৬%',
    stats_stat2_label: 'ব্যবহারকারী টেলিমেডিসিনকে সাশ্রয়ী ও জীবনরক্ষাকারী বিকল্প হিসেবে গ্রহণ করেছেন।',
    stats_stat3_number: '১০ মিনিট',
    stats_stat3_label: 'আমাদের পোর্টালে দূরবর্তী বিশেষজ্ঞ চিকিৎসকের সাথে যোগাযোগের গড় সময়।',
    stats_stat4_number: '২৪/৭',
    stats_stat4_label: 'গ্রামীণ অঞ্চলের ধীরগতির ইন্টারনেটেও সার্বক্ষণিক জরুরি সেবা সহায়তা।',

    // How It Works
    how_badge: 'সহজ ৩ ধাপের প্রক্রিয়া',
    how_title: 'সবার জন্য সহজ কার্যপদ্ধতি',
    how_subtitle: 'প্রবীণ ও স্বল্প প্রযুক্তিজ্ঞানী মানুষদের উপযোগী করে ডিজাইন করা হয়েছে।',
    how_step1_number: '০১',
    how_step1_title: 'প্রোফাইল তৈরি করুন',
    how_step1_desc: 'আপনার মোবাইল নম্বর বা জাতীয় পরিচয়পত্র দিয়ে মাত্র ৩০ সেকেন্ডে সহজে অ্যাকাউন্ট খুলুন।',
    how_step2_number: '০২',
    how_step2_title: 'প্রয়োজনীয় সেবা বেছে নিন',
    how_step2_desc: 'এআই টুলে লক্ষণ পরীক্ষা করুন, স্থানীয় ডাক্তার খুঁজুন অথবা সরাসরি ভিডিও কলে পরামর্শ নিন।',
    how_step3_number: '০৩',
    how_step3_title: 'চিকিৎসা ও পরামর্শ গ্রহণ করুন',
    how_step3_desc: 'ডিজিটাল প্রেসক্রিপশন পান এবং ফোনে সময়মতো নিয়মিত ওষুধ সেবনের রিমাইন্ডার গ্রহণ করুন।',

    // Testimonial
    trust_callout_quote: '"বন্যার সময় আমাদের গ্রামের রাস্তাঘাট ডুবে গিয়েছিল। এই প্লাটফর্মের মাধ্যমে মাত্র ১৫ মিনিটে আমার মায়ের জন্য বিশেষজ্ঞ ডাক্তারের পরামর্শ ও সহজ বাংলায় ওষুধের নির্দেশ পেয়েছিলাম।"',
    trust_callout_author: '— রফিকুল ইসলাম, কমিউনিটি স্বাস্থ্যকর্মী, রংপুর',

    // Footer
    footer_tagline: 'আধুনিক কৃত্রিম বুদ্ধিমত্তা ও মানবিক আন্তরিকতায় গ্রামীণ প্রতিটি পরিবারের নির্ভরযোগ্য ডিজিটাল স্বাস্থ্যসেবা।',
    footer_quick_links: 'প্রয়োজনীয় লিংক',
    footer_about: 'আমাদের সম্পর্কে',
    footer_privacy: 'গোপনীয়তা নীতিমালা',
    footer_terms: 'ব্যবহারের শর্তাবলী',
    footer_support: 'সহায়তা ও হেল্প সেন্টার',
    footer_contact_title: 'জরুরি ও কমিউনিটি যোগাযোগ',
    footer_helpline_label: '২৪/৭ জাতীয় স্বাস্থ্য বাতায়ন',
    footer_phone: '+৮৮০ ১৬২৬৩ / +৮৮০ ৯৬১২-HEALTH',
    footer_email: 'care@commhealth.ai',
    footer_location: 'কমিউনিটি হেলথ মিশন, ঢাকা ও উপজেলা আঞ্চলিক স্বাস্থ্য সেবা কেন্দ্র',
    footer_emergency_disclaimer_title: 'জরুরি চিকিৎসা বিষয়ক সতর্কতা',
    footer_emergency_disclaimer: 'যদি রোগীর তীব্র বুকে ব্যথা, মারাত্মক শ্বাসকষ্ট বা অতিরিক্ত রক্তক্ষরণ দেখা দেয়, তবে বিলম্ব না করে নিকটস্থ সরকারি হাসপাতাল বা জাতীয় জরুরি সেবা ৯৯৯ এ কল করুন। এই সেবা সাধারণ পরামর্শের জন্য, নিবিড় জরুরি চিকিৎসার বিকল্প নয়।',
    footer_copyright: 'সর্বস্বত্ব সংরক্ষিত। গ্রামীণ ও সুবিধাবঞ্চিত জনগোষ্ঠীর সার্বিক কল্যাণে নিবেদিত।'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('commhealth_lang');
    return (saved === 'bn' || saved === 'en') ? saved : 'en';
  });

  const [textSize, setTextSizeState] = useState<TextSize>(() => {
    const saved = localStorage.getItem('commhealth_textsize');
    return (saved === 'large' || saved === 'normal') ? saved : 'normal';
  });

  const [lowBandwidth, setLowBandwidthState] = useState<boolean>(() => {
    return localStorage.getItem('commhealth_low_bandwidth') === 'true';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('commhealth_lang', newLang);
  };

  const setTextSize = (newSize: TextSize) => {
    setTextSizeState(newSize);
    localStorage.setItem('commhealth_textsize', newSize);
  };

  const setLowBandwidth = (enabled: boolean) => {
    setLowBandwidthState(enabled);
    localStorage.setItem('commhealth_low_bandwidth', enabled ? 'true' : 'false');
  };

  const t = (key: string): string => {
    return translations[lang]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, textSize, setTextSize, lowBandwidth, setLowBandwidth, t }}>
      <div className={textSize === 'large' ? 'text-lg leading-relaxed' : ''}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
