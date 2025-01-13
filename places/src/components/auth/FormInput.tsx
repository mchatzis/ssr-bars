interface InputFieldProps {
  id: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}

export default function FormInput({ id, name, type = "text", placeholder, required = false }: InputFieldProps) {
  return (
    <input
      id={id}
      name={name}
      type={type}
      placeholder={placeholder}
      required={required}
      className="border border-gray-300 rounded-md px-4 py-2 w-full text-white bg-slate-700"
    />
  );
}