export function buildProfilingPayload(profile, answers) {
  const normalizedAnswers = (answers || [])
    .filter(Boolean)
    .map((a) => ({ id: a.id, answare: a.answer, category: a.category, type: a.type, statement: a.statement }));
  return {
    profile: {
      name: profile.name,
      age: Number(profile.age),
      gender: profile.gender,
      city: profile.city,
      occupation: profile.occupation,
      phoneNumber: profile.phoneNumber,
      email: profile.email,
    },
    answers: normalizedAnswers,
  };
}