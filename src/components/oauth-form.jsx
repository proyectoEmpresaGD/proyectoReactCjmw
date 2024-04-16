import { loginGoogle } from "@/lib/actions"

function OAuthForm() {

  return (
    <>
      <form className='oauth'>
        <button formAction={loginGoogle} className="social-button">
          <img src="/google.png" alt="Google" />  Iniciar sesión con Google
        </button>
      </form>
    </>
  )
}

export default OAuthForm;