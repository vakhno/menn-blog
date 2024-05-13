import React, { useState, useEffect, useRef } from 'react';
import { HiPhotograph } from 'react-icons/hi';
import { HiOutlineXCircle } from 'react-icons/hi';
import Image from 'next/image';

type Props = { handleChange: (value: File | null) => void; defaultValue: File | null };

export const DragAndDropFile = ({ handleChange, defaultValue }: Props) => {
	const [previewImage, setPreviewImage] = useState<null | string>(null);
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [isDragEnter, setIsDragEnter] = useState<boolean>(false);
	const postImageRef = useRef<HTMLInputElement | null>(null);

	useEffect(() => {
		const cleanUp = () => {
			previewImage && URL.revokeObjectURL(previewImage);
		};
		if (imageFile) {
			handleChange(imageFile);
			const previewFile = URL.createObjectURL(imageFile);
			setPreviewImage(previewFile);
		} else {
			handleChange(null);
		}
		return cleanUp;
	}, [imageFile]);

	useEffect(() => {
		setImageFile(defaultValue);
	}, [defaultValue]);

	const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (!imageFile) {
			postImageRef && postImageRef?.current && postImageRef.current.click();
		} else {
			setImageFile(null);
			setPreviewImage(null);
			if (postImageRef && postImageRef?.current) {
				postImageRef.current.value = '';
			}
		}
	};

	const handleInputImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e?.currentTarget?.files && e?.currentTarget?.files[0];
		setImageFile(file);
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		const imageTypes = ['image/png', 'image/jpeg'];
		const fileType = e.dataTransfer.files[0].type;
		if (imageTypes.includes(fileType)) {
			const file = e?.dataTransfer?.files && e?.dataTransfer?.files[0];
			setImageFile(file);
			setIsDragEnter(false);
		} else {
			setIsDragEnter(false);
		}
	};

	const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragEnter(false);
	};

	const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragEnter(true);
	};

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
	};

	return (
		<>
			<div
				className={`${imageFile ? 'border-none' : isDragEnter ? 'border-solid' : 'border-dashed'} ${
					imageFile ? '' : 'hover:bg-gray-200'
				} group h-[300px] bg-white relative rounded-md mb-2 cursor-pointer border-2 border-slate-950`}
				onClick={handleImageClick}
				onDrop={handleDrop}
				onDragLeave={handleDragLeave}
				onDragEnter={handleDragEnter}
				onDragOver={handleDragOver}>
				{previewImage ? (
					<>
						<Image
							src={previewImage}
							className="group-hover:blur-md"
							alt="Post image"
							layout="fill"
							objectFit="contain"
						/>
						<HiOutlineXCircle className="h-40 w-40 group-hover:visible absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] invisible" />
					</>
				) : (
					<div className="pointer-events-none absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
						<div className="flex flex-col items-center">
							<HiPhotograph className="w-20 h-20" />
							<span>Drop image or click to upload!</span>
						</div>
					</div>
				)}
			</div>
			<input
				type="file"
				hidden
				ref={postImageRef}
				onChange={handleInputImageChange}
				accept="image/png, image/jpeg"
			/>
		</>
	);
};
