// Question data model documentation:
// - type: "number" | "scale"
//   * number: pilih bilangan bulat 1–10 (tidak membutuhkan field options)
//   * scale: skala Likert 1..5 (label ditentukan di UI; tidak membutuhkan field options)
// - text: teks pertanyaan yang ditampilkan
// Catatan: tipe "single" telah dihapus. Untuk menambah tipe baru, definisikan render dan validasi di Questioner.jsx.
export const QUESTIONS = [
  {
    id: 1,
    category: "Extraversion / Introversion",
    type: "scale",
    text: "Saya merasa percaya diri saat berinteraksi dengan orang baru.",
  },
  {
    id: 2,
    category: "Thinking / Feeling",
    type: "number",
    text: "Seberapa nyaman kamu menghadiri acara besar? (1=tidak nyaman, 10=sangat nyaman)",
  },
  {
    id: 3,
    category: "Thinking / Feeling",
    type: "scale",
    text: "I communicate clearly and effectively in most situations.",
  },
  {
    id: 4,
    category: "Judging / Perceiving",
    type: "scale",
    text: "I rely on structured analysis when making decisions.",
  },
  {
    id: 5,
    category: "Social Comfort & Interaction",
    type: "scale",
    text: "Achievement is a strong motivator for me.",
  },
  {
    id: 6,
    category: "Behavior & Decision Making",
    type: "scale",
    text: "Saya lebih suka bekerja dalam kelompok daripada sendiri.",
  },
  {
    id: 7,
    category: "Openness & Growth",
    type: "number",
    text: "Seberapa sering kamu menghadiri meetup setiap bulan? (1-10)",
  },
  {
    id: 8,
    category: "Interest & Social Preference",
    type: "scale",
    text: "I address conflicts directly and constructively.",
  },
  {
    id: 9,
    category: "Meetup Style",
    type: "scale",
    text: "I initiate conversations when meeting new people.",
  },
  {
    id: 10,
    category: "Connection Goals",
    type: "scale",
    text: "I thrive best in structured environments.",
  },
];