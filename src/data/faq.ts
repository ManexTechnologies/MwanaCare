export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS = [
  { question: 'help.faq.q1', answer: 'help.faq.a1' },
  { question: 'help.faq.q2', answer: 'help.faq.a2' },
  { question: 'help.faq.q3', answer: 'help.faq.a3' },
  { question: 'help.faq.q4', answer: 'help.faq.a4' },
];

export const FAQ_TRANSLATIONS: Record<string, FaqItem> = {
  'help.faq.q1': { question: 'How do I track my baby\'s growth?', answer: 'Go to the Growth tab and tap "Add Measurement" to record your baby\'s weight, height, and head circumference. Charts will automatically update to show progress over time.' },
  'help.faq.q2': { question: 'How are vaccine reminders set?', answer: 'Navigate to Settings > Notifications and enable "Vaccine Reminders". You\'ll receive alerts before each scheduled immunization based on your baby\'s age.' },
  'help.faq.q3': { question: 'Can I share my child\'s health data?', answer: 'Yes! Use the "Export Data" option in Settings to generate a PDF or CSV report. You can then share it with your healthcare provider via your preferred messaging app.' },
  'help.faq.q4': { question: 'How do I change the app language?', answer: 'Go to Settings > Language and select your preferred language. The app currently supports English, Shona, and Ndebele.' },
  // Shona
  'shona.help.faq.q1': { question: 'Ndingatevedzera sei kukura kwemwana wangu?', answer: 'Enda kuGrowth tab wobva wabaya "Add Measurement" kunyora huremu, kureba, nekukura kwemusoro wemwana wako. Machati anozogadziriswa otomatiki kuratidza fambiro mberi nekufamba kwenguva.' },
  'shona.help.faq.q2': { question: 'Zviyeuchidzo zvejekiso zvinoswa sei?', answer: 'Enda kuSettings > Notifications wobva wagonesa "Vaccine Reminders". Uchagamuchira zviyeuchidzo zvisati zvasvika zvichienderana nezera remwana wako.' },
  'shona.help.faq.q3': { question: 'Ndingagovana here data yeutano yemwana wangu?', answer: 'Hongu! Shandisa "Export Data" muSettings kugadzira PDF kana CSV report. Unogona kuigovana nemushandi weutano wako kuburikidza neapp yekutumira meseji.' },
  'shona.help.faq.q4': { question: 'Ndoshandura sei mutauro weapp?', answer: 'Enda kuSettings > Language wobva wasarudza mutauro waunoda. Iyi app inotsigira Chirungu, chiShona, neSiNdebele.' },
  // Ndebele
  'ndebele.help.faq.q1': { question: 'Ngisilandela kanjani ukukhula komntwana wami?', answer: 'Yana ku-Growth tab uthephe "Add Measurement" ukubhala isisindo, ubude, nobukhulu bekhanda lomntwana wakho. Amashadi azohleleka ngokuzenzakalelayo ukukhombisa inqubekela phambili.' },
  'ndebele.help.faq.q2': { question: 'Izikhumbuzo zemijovo zisethwa kanjani?', answer: 'Yana ku-Settings > Notifications unikhethe "Vaccine Reminders". Uzothola izikhumbuzo ngaphambi komjovo ngamunye ohleliwe ngokweminyaka yomntwana wakho.' },
  'ndebele.help.faq.q3': { question: 'Ngingabelana ngemininingwane yezempilo yomntwana wami?', answer: 'Yebo! Sebenzisa "Export Data" ku-Settings ukukhiqiza umbiko wePDF noma we-CSV. Ungase wabelane ngayo nomsebenzi wakho wezempilo nge-app yakho yokuthumela imilayezo.' },
  'ndebele.help.faq.q4': { question: 'Ngilishintsha kanjani ulimi lwe-app?', answer: 'Yana ku-Settings > Language ukhethe ulimi oluthandayo. I-app usekela isiNgisi, isiShona, kanye ne-isiNdebele.' },
};

