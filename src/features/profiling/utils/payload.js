export function buildProfilingPayload(profile, answers) {
  const normalizedAnswers = (answers || [])
    .filter(Boolean)
    .map((a) => ({ id: a.id, value: a.value }));
  return {
    profile: {
      fullName: profile.fullName,
      age: Number(profile.age),
      gender: profile.gender,
      city: profile.city,
      occupation: profile.occupation,
    },
    answers: normalizedAnswers,
  };
}