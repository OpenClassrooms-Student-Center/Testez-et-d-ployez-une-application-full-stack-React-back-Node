export const CONTACT_TYPES = ["personnel", "entreprise"];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateText = (value, { field, label, min, max }, errors) => {
  if (typeof value !== "string" || value.trim() === "") {
    errors.push({ field, message: `${label} est obligatoire` });
    return undefined;
  }
  const text = value.trim();
  if (text.length < min || text.length > max) {
    errors.push({
      field,
      message: `${label} doit contenir entre ${min} et ${max} caractères`,
    });
  }
  return text;
};

export const validateContact = (body) => {
  const input = body && typeof body === "object" ? body : {};
  const errors = [];

  const lastName = validateText(
    input.lastName,
    { field: "lastName", label: "Le nom", min: 1, max: 100 },
    errors,
  );
  const firstName = validateText(
    input.firstName,
    { field: "firstName", label: "Le prénom", min: 1, max: 100 },
    errors,
  );
  const message = validateText(
    input.message,
    { field: "message", label: "Le message", min: 10, max: 2000 },
    errors,
  );

  if (!CONTACT_TYPES.includes(input.type)) {
    errors.push({
      field: "type",
      message: `Le type doit valoir ${CONTACT_TYPES.map((t) => `"${t}"`).join(" ou ")}`,
    });
  }

  const email = typeof input.email === "string" ? input.email.trim() : "";
  if (!email) {
    errors.push({
      field: "email",
      message: "L'adresse e-mail est obligatoire",
    });
  } else if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
    errors.push({ field: "email", message: "L'adresse e-mail est invalide" });
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }
  return {
    valid: true,
    value: { lastName, firstName, type: input.type, email, message },
  };
};
