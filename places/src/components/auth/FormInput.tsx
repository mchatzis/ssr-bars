interface InputFieldProps {
    id: string;
    name: string;
    type?: string;
    placeholder?: string;
  }

export default function FormInput({ id, name, type = "text", placeholder }: InputFieldProps) {
    return (
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        className="border border-gray-300 rounded-md px-4 py-2 w-full"
      />
    );
  }