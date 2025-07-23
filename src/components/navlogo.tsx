import Image from "next/image";

const Navlogo = ({ size }: { size: number }) => {
    return (
        <div className="">
            <Image
                width={size}
                height={size}
                src="/icons/navlogo.png"
                alt="Rflect Logo"
            />
        </div>

    );
}

export default Navlogo;