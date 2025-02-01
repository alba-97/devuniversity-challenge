import { z } from "zod";
import { signIn } from "next-auth/react";

const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function loginAction(formData: FormData) {
  const validatedFields = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.errors[0].message,
    };
  }

  try {
    const result = await signIn("credentials", {
      redirect: false,
      email: validatedFields.data.email,
      password: validatedFields.data.password,
    });

    if (result?.error) {
      return {
        error: "Invalid credentials",
      };
    }

    return { success: true };
  } catch (error) {
    return {
      error: "An unexpected error occurred",
    };
  }
}
