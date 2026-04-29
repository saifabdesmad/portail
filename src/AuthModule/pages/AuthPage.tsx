import React, { FormEvent, useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CharacterContext } from "../context/CharactersContext";
import { CharacterOrchestratorService } from "../service/CharacterOrchestratorService";
import { useAuth } from "../../context/AuthContext";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const orchestrator = useContext(CharacterContext) as CharacterOrchestratorService | null;
  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("tab") === "signup") {
      setMode("signup");
    }
  }, [searchParams]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onEmailFocus = () => {
    orchestrator?.onEmailStartTyping();
  };

  const onEmailBlur = () => {
    orchestrator?.onEmailTypingFinished();
  };


  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
    if (!isPasswordVisible) {
      orchestrator?.makeCharacterAnxious();
    } else {
      orchestrator?.reset();
    }
  };

  const handleModeChange = (nextMode: "login" | "signup") => {
    setMode(nextMode);
    setError("");
    setIsPasswordVisible(false);
    if (nextMode === "signup") {
      setSearchParams({ tab: "signup" }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
    orchestrator?.reset();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (mode === "signup") {
      const trimmedName = name.trim();
      if (!trimmedName || !trimmedEmail || !trimmedPassword || !confirmPassword.trim()) {
        setError("Veuillez remplir tous les champs.");
        orchestrator?.makeCharacterSad();
        return;
      }

      if (trimmedPassword !== confirmPassword.trim()) {
        setError("Les mots de passe ne correspondent pas.");
        orchestrator?.makeCharacterSad();
        return;
      }
    } else if (!trimmedEmail || !trimmedPassword) {
      setError("Veuillez remplir votre email et votre mot de passe.");
      orchestrator?.makeCharacterSad();
      return;
    }

    setIsSubmitting(true);

    const success =
      mode === "login"
        ? await login(trimmedEmail, trimmedPassword)
        : await register(name.trim(), trimmedEmail, trimmedPassword);

    setIsSubmitting(false);

    if (!success) {
      setError(
        mode === "login"
          ? "Impossible de vous connecter avec ces identifiants."
          : "Impossible de créer le compte pour le moment."
      );
      orchestrator?.makeCharacterSad();
      return;
    }

    navigate("/", { replace: true });
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">
          {mode === "login" ? "Bon retour 👋" : "Rejoignez WAY"}
        </h1>

        <p className="text-gray-500 mt-2">
          {mode === "login"
            ? "Connecte-toi pour continuer ton expérience"
            : "Crée un compte pour commencer"}
        </p>
      </div>

      <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
        <button
          type="button"
          onClick={() => handleModeChange("login")}
          className={`flex-1 py-2 rounded-lg font-medium transition ${
            mode === "login"
              ? "bg-white shadow text-black"
              : "text-gray-500"
          }`}
        >
          Connexion
        </button>

        <button
          type="button"
          onClick={() => handleModeChange("signup")}
          className={`flex-1 py-2 rounded-lg font-medium transition ${
            mode === "signup"
              ? "bg-white shadow text-black"
              : "text-gray-500"
          }`}
        >
          Inscription
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6"
      >
        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {mode === "signup" && (
          <div className="mb-4">
            <label htmlFor="auth-name" className="text-sm text-gray-600">
              Nom complet
            </label>
            <input
              id="auth-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Votre nom"
              className="w-full mt-1 px-4 py-3 rounded-xl bg-gray-50 border focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="auth-email" className="text-sm text-gray-600">
            Email
          </label>
          <input
            id="auth-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            onFocus={onEmailFocus}
            onBlur={onEmailBlur}
            placeholder="vous@email.com"
            className="w-full mt-1 px-4 py-3 rounded-xl bg-gray-50 border focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <div className="mb-2">
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="auth-password" className="text-sm text-gray-600">
              Mot de passe
            </label>

            <button
              type="button"
              onClick={togglePasswordVisibility}
              aria-pressed={isPasswordVisible}
              aria-label={isPasswordVisible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              className="text-xs font-medium text-teal-500 hover:underline"
            >
              {isPasswordVisible ? "Masquer" : "Afficher"}
            </button>
          </div>

          <input
            id="auth-password"
            type={isPasswordVisible ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            className="w-full mt-1 px-4 py-3 rounded-xl bg-gray-50 border focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        {mode === "login" && (
          <div className="text-right mb-4">
            <button type="button" className="text-sm text-teal-500 hover:underline">
              Mot de passe oublié ?
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 rounded-xl transition"
        >
          {isSubmitting
            ? "En cours..."
            : mode === "login"
              ? "Se connecter"
              : "Créer un compte"}
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          {mode === "login"
            ? "Pas encore de compte ? "
            : "Déjà un compte ? "}

          <button
            type="button"
            onClick={() =>
              handleModeChange(mode === "login" ? "signup" : "login")
            }
            className="text-teal-500 font-medium hover:underline"
          >
            {mode === "login" ? "Créer un compte" : "Se connecter"}
          </button>
        </p>
      </form>

      <p className="text-center text-xs text-gray-400 mt-6">
        Secure authentication • WAY 3D system
      </p>
    </div>
  );
}