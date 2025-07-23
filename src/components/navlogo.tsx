import Image from "next/image";

const Navlogo = ({ size }: { size: number }) => {
    return (
        <div
            className="flex items-center justify-center"
            style={{
                width: `${size}px`,
                height: `${size}px`,
                minWidth: `${size}px`,
                minHeight: `${size}px`
            }}
        >
            <Image
                width={size}
                height={size}
                loading="eager"
                priority={true}
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain"
                }}
                src="/icons/navlogo.png"
                alt="Rflect Logo"
            />
        </div>
    );
}

export default Navlogo;