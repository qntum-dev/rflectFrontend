"use client";

import { useState, useCallback, useTransition, Dispatch, SetStateAction } from "react";
import Cropper, { Area } from "react-easy-crop";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { getCroppedImg } from "@/lib/crop-image";
import Image from "next/image";
import { uploadProfileImg } from "@/app/actions/profile-actions";
import { useRouter } from "next/navigation";
import { useAuthStore } from "./stores/auth-store";
import { DialogTitle } from "./ui/dialog";

const ChooseProfileImg = ({ type, setOpen }: { type: "new" | "existing", setOpen?: Dispatch<SetStateAction<boolean>> }) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const updateUser = useAuthStore((state) => state.updateUser);
    const router = useRouter();

    const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                setImageSrc(reader.result as string);
                setUploadedUrl(null);
                setError(null);
            });
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = async () => {
        if (!imageSrc || !croppedAreaPixels) return;
        setError(null);

        try {
            const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
            const file = new File([croppedBlob], "profile.jpg", { type: "image/jpeg" });
            const formData = new FormData();
            formData.append("file", file);

            startTransition(async () => {
                const res = await uploadProfileImg(formData);
                if (!res.success) {
                    setError(res.error || "Upload failed");
                    return;
                }
                setUploadedUrl(res.data?.url ?? null);
                updateUser({ profileImgUrl: res.data?.url ?? null }); // Update user state with new profile image
            });
        } catch (err) {
            console.error(err);
            setError("Upload failed. Please try again.");
        }
    };

    return (
        <div className="rounded-2xl bg-gray-900 px-12 py-4 flex flex-col items-center">
            {/* */}
            {type === "existing" ? (<DialogTitle className="text-xl font-bold mb-2 text-blue-400 text-center w-full">Choose a profile picture</DialogTitle>) : (<h2 className="text-xl font-bold mb-2 text-blue-400">Choose profile picture</h2>)}

            {type === "new" && <p className="text-gray-300 mb-4 text-center">Choose a photo that represents you!</p>}


            {/* File picker if no image yet */}
            {!imageSrc && !uploadedUrl && (
                <div className="flex flex-col items-center gap-6">
                    <label className="relative w-32 h-32 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition">
                        <span className="text-4xl text-gray-400">+</span>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                    </label>
                    <div className="cursor-pointer" onClick={() => type === "new" ? router.push("/chat") : setOpen && setOpen(false)} >

                        <p className="text-red-600 text-lg">Skip</p>
                    </div>
                </div>
            )}

            {/* Cropper */}
            {imageSrc && !uploadedUrl && (
                <>
                    <div className="relative w-64 h-64 rounded-full overflow-hidden">
                        <Cropper
                            image={imageSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
                            onCropChange={setCrop}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                        />
                    </div>

                    <div className="w-64 mt-4">
                        <label className="text-sm text-gray-500 mb-1 block">Zoom</label>
                        <Slider
                            min={1}
                            max={3}
                            step={0.1}
                            value={[zoom]}
                            onValueChange={(val) => setZoom(val[0])}
                        />
                        <Button onClick={handleUpload} disabled={isPending} className="mt-4 w-full">
                            {isPending ? "Uploading..." : "Upload"}
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => setImageSrc(null)}
                            className="mt-2 w-full"
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                    </div>
                </>
            )}

            {/* Uploaded preview */}
            {uploadedUrl && (
                <div className="flex flex-col items-center mt-6">
                    <p className="text-green-600">Uploaded Successfully!</p>
                    <Image
                        src={uploadedUrl}
                        alt="Profile"
                        width={128}
                        height={128}
                        className="rounded-full mt-2 border shadow"
                    />
                    <Button
                        variant="secondary"
                        onClick={() => {
                            setImageSrc(null);
                            setUploadedUrl(null);
                            setError(null);
                        }}
                        className="mt-4 w-40"
                    >
                        Re-upload
                    </Button>
                    <Button
                        onClick={() => type === "new" ? router.push("/chat") : setOpen && setOpen(false)} // or your next onboarding route
                        className="mt-2 w-40"
                    >
                        Next
                    </Button>
                </div>
            )}

            {error && <p className="text-red-600 mt-4">{error}</p>}
        </div>
    );
};

export default ChooseProfileImg;
