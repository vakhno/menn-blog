'use client';
import React, { useState, useEffect } from 'react';
import { HiHashtag } from 'react-icons/hi';
import { HiXCircle } from 'react-icons/hi';
import {
	Command,
	CommandEmpty,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DragAndDropFile } from '@/components/ui/dragAndDropFile';

import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/js/plugins.pkgd.min.js';
import Froala from 'react-froala-wysiwyg';
import FroalaEditorView from 'react-froala-wysiwyg/FroalaEditorView';

import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { getTags } from '@/lib/redux/slices/tagSlice';
import { useAuthorized } from '@/hooks/useAuthorized';
import { postPost } from '@/lib/redux/slices/postSlice';
import { useRouter } from 'next/navigation';

const page = () => {
	useAuthorized();
	const dispatch = useAppDispatch();
	const router = useRouter();
	const { tags } = useAppSelector((state) => state.tag);
	const { user } = useAppSelector((state) => state.auth);
	const [allTags, setAllTags] = useState(tags);
	const [open, setOpen] = useState(false);
	const [selectedTags, setSelectedTags] = useState([]);
	const [image, setImage] = useState<File | null>(null);
	const [description, setDescription] = useState('');
	const [title, setTitle] = useState('');
	const [text, setText] = useState('');

	const handleTextChange = (e: any) => {
		setText(e);
	};

	useEffect(() => {
		dispatch(getTags());
	}, []);

	useEffect(() => {
		setAllTags(tags);
	}, [tags]);

	const handleTagRemoving = (tagLabel = {}) => {
		const filteredSelectedTags = selectedTags.filter(
			(selectedTag: any) => selectedTag.label !== tagLabel.label,
		);
		setSelectedTags(filteredSelectedTags);
		setAllTags([...allTags, tagLabel]);
	};

	const imageChange = (e: File | null) => {
		setImage(e);
	};

	const handleSubmit = async () => {
		const fields = {
			title,
			description,
			author: user._id,
			text,
			tags: selectedTags,
		};
		dispatch(postPost({ fields, image, router }));
	};

	const handleCancel = () => {
		router.push('/');
	};

	return (
		<div className="editor-container pt-5 mx-auto max-w-4xl">
			<DragAndDropFile handleChange={imageChange} />
			<Input
				placeholder="Title..."
				className="mb-2"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
			/>
			<Input
				placeholder="Short description..."
				className="mb-2"
				value={description}
				onChange={(e) => setDescription(e.target.value)}
			/>
			<div className="editor-title-input mb-2">
				<Froala
					model={text}
					onModelChange={handleTextChange}
					tag="textarea"
					config={{
						attribution: false,
						placeholder: 'Text...',
						events: {
							'image.beforeUpload': function () {},
							'image.removed': function () {},
						},
						toolbarButtons: {
							moreText: {
								buttons: [
									'bold',
									'italic',
									'underline',
									'strikeThrough',
									'subscript',
									'superscript',
									'fontFamily',
									'fontSize',
									'textColor',
									'backgroundColor',
									'inlineClass',
									'inlineStyle',
									'clearFormatting',
								],
							},
							moreParagraph: {
								buttons: [
									'alignLeft',
									'alignCenter',
									'formatOLSimple',
									'alignRight',
									'alignJustify',
									'formatOL',
									'formatUL',
									'paragraphFormat',
									'paragraphStyle',
									'lineHeight',
									'outdent',
									'indent',
									'quote',
								],
							},
							moreRich: {
								buttons: [
									'insertLink',
									// 'insertImage',
									// 'insertVideo',
									'insertTable',
									'emoticons',
									'fontAwesome',
									'specialCharacters',
									'embedly',
									// 'insertFile',
									'insertHR',
								],
							},
							moreMisc: {
								buttons: [
									'undo',
									'redo',
									'fullscreen',
									'print',
									'getPDF',
									'spellChecker',
									'selectAll',
									'html',
									'help',
								],
								align: 'right',
								buttonsVisible: 2,
							},
						},
						pluginsEnabled: [
							'table',
							'spell',
							'quote',
							'save',
							'quickInsert',
							'paragraphFormat',
							'paragraphStyle',
							'help',
							'draggable',
							'align',
							'link',
							'lists',
							// 'file',
							// 'image',
							'emoticons',
							'url',
							// 'video',
							'embedly',
							'colors',
							'entities',
							'inlineClass',
							'inlineStyle',
							// 'codeBeautif '
							// 'spellChecker',
							// 'imageTUI',
						],
					}}
				/>
				{text.length ? (
					<div>
						<span className="font-bold">Preview:</span> <FroalaEditorView model={text} />
					</div>
				) : null}
			</div>
			<Popover open={open} onOpenChange={() => setOpen(!open)}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						role="combobox"
						aria-expanded={open}
						className="justify-start w-full h-auto flex flex-wrap mb-2">
						<div className="flex flex-wrap">
							{selectedTags.map((selectedTag: any) => (
								<Badge
									key={selectedTag.label}
									className="cursor-pointer mr-2 px-2"
									onClick={(e) => {
										e.stopPropagation();
										handleTagRemoving(selectedTag);
									}}>
									<HiHashtag />
									<span className="mr-1">{selectedTag.label}</span>
									<HiXCircle />
								</Badge>
							))}
						</div>
						{!selectedTags.length ? <span>{`Select tag...`}</span> : null}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-full p-0">
					<Command>
						<CommandInput placeholder="Search tag..." className="h-9" />
						<CommandEmpty>No tag found.</CommandEmpty>
						<CommandList>
							{allTags.map((tag) => (
								<CommandItem
									key={tag._id}
									value={tag.value}
									onSelect={() => {
										setAllTags(allTags.filter((allTag) => allTag.value !== tag.value));
										setSelectedTags([...selectedTags, tag]);
									}}>
									{tag.label}
								</CommandItem>
							))}
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
			<div className="flex w-full justify-between">
				<Button onClick={handleCancel}>Cancel</Button>
				<Button type="submit" onClick={handleSubmit}>
					Submit
				</Button>
			</div>
		</div>
	);
};

export default page;
