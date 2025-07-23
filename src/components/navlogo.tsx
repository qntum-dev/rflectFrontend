import Image from "next/image";

const Navlogo = ({ size }: { size: number }) => {
    return (
        <div className="">
            <Image
                width={size}
                height={size}
                sizes="100vw"
                loading="eager"
                priority={true}
                style={{
                    maxWidth: "100%",
                    height: "auto",
                }}
                src="/icons/navlogo.png"
                alt="Rflect Logo"
            />
        </div>

    );
}

export default Navlogo;