interface DropdownProps {
    options: string[];
    onClick: (e: React.MouseEvent, option: string) => any;
    onContextMenu: (e: React.MouseEvent, option: string) => any;
    className?: string;
}
export function DropDown({ options, onClick, onContextMenu, className }: DropdownProps) {
    return (
        <div className={`h-fit max-h-[13vh] relative z-popup rounded-xl overflow-y-auto bg-discrete ${className}`}>
            <ul className='w-full h-full text-base text-textColor/90'>
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