'use client';
import React, { useEffect } from 'react';
// UI components
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
// react-hook-form
import { useForm } from 'react-hook-form';
// zod
import { ZodSchema } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

type TextareaFormValueTypes = {
	text: string;
};

type Props = {
	value?: string;
	placeholder?: string;
	isSuccess?: boolean;
	validationSchema?: ZodSchema;
	handleChange?: (value: string) => void;
	successEnter?: () => void;
	errorEnter?: () => void;
};

const TextareaForm = ({
	value = '',
	isSuccess = false,
	placeholder = '',
	validationSchema,
	handleChange,
	successEnter,
	errorEnter,
}: Props) => {
	const form = useForm<TextareaFormValueTypes>({
		defaultValues: {
			text: value || '',
		},
		resolver: validationSchema ? zodResolver(validationSchema) : undefined,
	});

	const handleSubmit = (values: { text: string }) => {
		if (isSuccess) {
			successEnter && successEnter();
			form.reset();
		} else {
			errorEnter && errorEnter();
		}
	};

	useEffect(() => {
		handleChange && handleChange(form.getValues('text'));
	}, [form.watch('text')]);

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col w-full">
				<FormField
					control={form.control}
					name="text"
					render={({ field }) => (
						<FormItem className="mb-2">
							<FormControl>
								<Textarea placeholder={placeholder} className="resize-none" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				{form.getValues('text').length ? (
					<Button type="submit" className="self-end bg">
						Submit
					</Button>
				) : null}
			</form>
		</Form>
	);
};

export default TextareaForm;
