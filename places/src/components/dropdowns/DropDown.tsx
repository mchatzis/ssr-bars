

interface DropdownProps {
    options: string[];
    onMouseDown: (option: string) => any;
}
export function DropDown({ options, onMouseDown }: DropdownProps) {
    return (
        <div className="w-full h-fit max-h-[15vh] relative z-[var(--z-popup)] rounded-xl overflow-y-scroll bg-discrete">
            <ul className='w-full h-full text-base text-white/90'>
                {options.map((option, index) => {
                    return (
                        <li
                            key={index}
                            className='block cursor-pointer px-1 py-1 border border-transparent hover:text-primary hover:rounded-lg
                                hover:border hover:border-primary'
                            onMouseDown={() => onMouseDown(option)}
                        >
                            {option}
                        </li>
                    );
                })}
            </ul>
        </div>
    )
}