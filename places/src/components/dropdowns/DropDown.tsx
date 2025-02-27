interface DropdownProps {
    options: string[];
    onClick: (e: React.MouseEvent, option: string) => any;
    onContextMenu: (e: React.MouseEvent, option: string) => any;
}
export function DropDown({ options, onClick, onContextMenu }: DropdownProps) {
    return (
        <div className="w-full h-fit max-h-[13vh] relative z-[var(--z-popup)] rounded-xl overflow-y-auto bg-discrete">
            <ul className='w-full h-full text-base text-white/90'>
                {options.map((option, index) => {
                    return (
                        <li
                            key={index}
                            className='block cursor-pointer px-1 py-1 border border-transparent hover:text-primary hover:rounded-xl
                                hover:border hover:border-primary'
                            onClick={(e) => onClick(e, option)}
                            onContextMenu={(e) => onContextMenu(e, option)}
                        >
                            {option}
                        </li>
                    );
                })}
            </ul>
        </div>
    )
}