import { useFormStatus } from 'react-dom'

function Button({title}) {
    const { pending } = useFormStatus()
    return (
        <button className="rounded-lg px-8 py-2 text-xl border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-blue-100 duration-300" type="submit" disabled={pending}  >
            {title}
        </button>
    )
}

export default Button