type GoogleSignInButtonProps = {
  onSignInSuccess: (response: unknown) => void;
};

export default function GoogleSignInButton({ onSignInSuccess }: GoogleSignInButtonProps) {
  return (
    <button type="button" className="button-chip" onClick={() => onSignInSuccess({ credential: "demo" })}>
      Continue with Google
    </button>
  );
}