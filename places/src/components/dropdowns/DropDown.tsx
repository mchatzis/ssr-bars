

interface DropdownProps {
    options: string[];
    onMouseDown: (option: string) => any;
}
export function DropDown({ options, onMouseDown }: DropdownProps) {
    return (
        <div className="w-full h-fit max-h-[15vh] relative z-[var(--z-popup)] rounded-xl overflow-y-scroll bg-primary">
            <ul className='w-full h-full text-base text-bgColor'>
                {options.map((option, index) => {
                    return (
                        <li
                            key={index}
                            className='block px-1 py-1 hover:bg-bgColor hover:text-primary hover:rounded-lg'
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