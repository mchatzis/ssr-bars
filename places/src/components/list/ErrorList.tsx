import { RegisterFormErrors } from "../auth/RegisterForm";

export default function ErrorList({ errors, className }: { errors: RegisterFormErrors, className: string }) {
    const errorList: JSX.Element[] = [];
    Object.entries(errors).forEach(([, value]) => {
        value.forEach((error) => (
            errorList.push(<li key={error}>- {error}</li>)
        ));
    })

    return (
        <div className={className}>
            <ul>
                {errorList}
            </ul>
        </div>
    )
}