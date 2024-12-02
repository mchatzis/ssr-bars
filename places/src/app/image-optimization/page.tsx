import Image from "next/image";

export default function ImageOptimization() {
    const prefix = process.env.IMAGE_BUCKET_PREFIX;

    return (
        <div>
            <Image
                src={prefix + "/test2.png"}
                alt="Physics"
                width={300}
                height={300}
            />
        </div>
    );
}