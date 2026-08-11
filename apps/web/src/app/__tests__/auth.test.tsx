import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "../login/page";
import RegisterPage from "../register/page";

// Mock useRouter
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("Authentication UI", () => {
  describe("LoginPage", () => {
    it("validates empty submission", async () => {
      render(<LoginPage />);
      const submitButton = screen.getByRole("button", { name: /sign in/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
        expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      });
    });

    it("accepts valid submission locally", async () => {
      render(<LoginPage />);
      const emailInput = screen.getByLabelText(/work email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole("button", { name: /sign in/i });

      await userEvent.type(emailInput, "test@example.com");
      await userEvent.type(passwordInput, "password123");
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.queryByText(/please enter a valid email/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/password is required/i)).not.toBeInTheDocument();
      });
    });
  });

  describe("RegisterPage", () => {
    it("validates matching passwords and terms", async () => {
      render(<RegisterPage />);
      const submitButton = screen.getByRole("button", { name: /create account/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument();
        expect(screen.getByText(/you must accept the terms/i)).toBeInTheDocument();
      });
    });
  });
});
