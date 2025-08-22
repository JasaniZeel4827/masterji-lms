// // "use client";

// // import { Button, buttonVariants } from "@/components/ui/button";
// // import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// // import { courseCategories, courseLevels, courseSchema, CourseSchemaType } from "@/lib/zodSchemas";
// // import { ArrowLeft, PlusIcon, SparkleIcon } from "lucide-react";
// // import Link from "next/link";
// // import { useForm } from "react-hook-form";
// // import { zodResolver } from "@hookform/resolvers/zod";
// // import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// // import { Input } from "@/components/ui/input";
// // import { Textarea } from "@/components/ui/textarea";
// // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// // export default function CourseCreationPage() {
// //     const form = useForm<CourseSchemaType>({
// //         resolver: zodResolver(courseSchema),
// //         defaultValues: {
// //             title: "",
// //             description: "",
// //             fileKey: "",
// //             price: 0,
// //             duration: 0,
// //             level: "BEGINNER",
// //             category: "Computer Science Fundamentals",
// //             smallDescription: "",
// //             slug: "",
// //             status: "DRAFT"
// //         },
// //     });

// //     function onSubmit(values: CourseSchemaType) {
// //         console.log(values);
// //     }

// //     function slugify(titleValue: string) {
// //         return titleValue
// //             .toLowerCase()
// //             .trim()
// //             .replace(/[\s\W-]+/g, "-")
// //             .replace(/^-+|-+$/g, "");
// //     }

// //     return (
// //         <>
// //             <div className="flex items-center gap-4">
// //                 <Link
// //                     href="/admin/courses"
// //                     className={buttonVariants({
// //                         variant: "outline",
// //                         size: "icon",
// //                     })}
// //                 >
// //                     <ArrowLeft className="size-4" />
// //                 </Link>
// //                 <h1 className="text-2xl font-bold">Create Course</h1>
// //             </div>

// //             <Card>
// //                 <CardHeader>
// //                     <CardTitle>Basic Information</CardTitle>
// //                     <CardDescription>
// //                         Provide the basic information for the course you want to create.
// //                     </CardDescription>
// //                 </CardHeader>
// //                 <CardContent>
// //                     <Form {...form}>
// //                         <form
// //                             className="space-y-6"
// //                             onSubmit={form.handleSubmit(onSubmit)}
// //                         >
// //                             <FormField
// //                                 control={form.control}
// //                                 name="title"
// //                                 render={({ field }) => (
// //                                     <FormItem>
// //                                         <FormLabel>Title</FormLabel>
// //                                         <FormControl>
// //                                             <Input placeholder="Title" {...field} />
// //                                         </FormControl>
// //                                     </FormItem>
// //                                 )}
// //                             />
// //                             <div className="flex gap-4 items-end">
// //                                 <FormField
// //                                     control={form.control}
// //                                     name="slug"
// //                                     render={({ field }) => (
// //                                         <FormItem className="w-full">
// //                                             <FormLabel>slug</FormLabel>
// //                                             <FormControl>
// //                                                 <Input placeholder="slug" {...field} />
// //                                             </FormControl>
// //                                             <FormMessage />
// //                                         </FormItem>
// //                                     )}
// //                                 />
// //                                 <Button
// //                                     type="button"
// //                                     className="w-fit"
// //                                     onClick={() => {
// //                                         const titleValue = form.getValues("title");
// //                                         const slug = slugify(titleValue);
// //                                         form.setValue("slug", slug, { shouldValidate: true });
// //                                     }}
// //                                 >
// //                                     Generate Slug <SparkleIcon className="ml-1" size={16} />
// //                                 </Button>
// //                             </div>
// //                             <FormField
// //                                 control={form.control}
// //                                 name="smallDescription"
// //                                 render={({ field }) => (
// //                                     <FormItem className="w-full">
// //                                         <FormLabel>smallDescription</FormLabel>
// //                                         <FormControl>
// //                                             <Textarea placeholder="smallDescription"
// //                                                 className="min-h-[120px]"
// //                                                 {...field} />
// //                                         </FormControl>
// //                                         <FormMessage />
// //                                     </FormItem>
// //                                 )}
// //                             />

// //                             <FormField
// //                                 control={form.control}
// //                                 name="description"
// //                                 render={({ field }) => (
// //                                     <FormItem className="w-full">
// //                                         <FormLabel>description</FormLabel>
// //                                         <FormControl>
// //                                             <Textarea placeholder="smallDescription"
// //                                                 className="min-h-[120px]"
// //                                                 {...field} />
// //                                         </FormControl>
// //                                         <FormMessage />
// //                                     </FormItem>
// //                                 )}
// //                             />
// //                             <FormField
// //                                 control={form.control}
// //                                 name="fileKey"
// //                                 render={({ field }) => (
// //                                     <FormItem className="w-full">
// //                                         <FormLabel>Thumbnail image</FormLabel>
// //                                         <FormControl>
// //                                             <Input placeholder="thumbnail url" {...field} />
// //                                         </FormControl>
// //                                         <FormMessage />
// //                                     </FormItem>
// //                                 )}
// //                             />
// //                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                                 <FormField
// //                                     control={form.control}
// //                                     name="category"
// //                                     render={({ field }) => (
// //                                         <FormItem className="w-full">
// //                                             <FormLabel>category</FormLabel>
// //                                             <Select onValueChange={field.onChange} defaultValue={field.value}>
// //                                                 <FormControl>
// //                                                     <SelectTrigger className="w-full">
// //                                                         <SelectValue placeholder="Select Category" />
// //                                                     </SelectTrigger>
// //                                                 </FormControl>
// //                                                 <SelectContent>
// //                                                     {courseCategories.map((category) => (
// //                                                         <SelectItem key={category} value={category}>
// //                                                             {category}
// //                                                         </SelectItem>
// //                                                     ))}
// //                                                 </SelectContent>
// //                                             </Select>
// //                                             <FormMessage />
// //                                         </FormItem>
// //                                     )}
// //                                 />
// //                                 <FormField
// //                                     control={form.control}
// //                                     name="level"
// //                                     render={({ field }) => (
// //                                         <FormItem className="w-full">
// //                                             <FormLabel>level</FormLabel>
// //                                             <Select onValueChange={field.onChange} defaultValue={field.value}>
// //                                                 <FormControl>
// //                                                     <SelectTrigger className="w-full">
// //                                                         <SelectValue placeholder="Select value" />
// //                                                     </SelectTrigger>
// //                                                 </FormControl>
// //                                                 <SelectContent>
// //                                                     {courseLevels.map((category) => (
// //                                                         <SelectItem key={category} value={category}>
// //                                                             {category}
// //                                                         </SelectItem>
// //                                                     ))}
// //                                                 </SelectContent>
// //                                             </Select>
// //                                             <FormMessage />
// //                                         </FormItem>
// //                                     )}
// //                                 />
// //                                 <FormField
// //                                     control={form.control}
// //                                     name="duration"
// //                                     render={({ field }) => (
// //                                         <FormItem className="w-full">
// //                                             <FormLabel>duration (hours)</FormLabel>
// //                                             <FormControl>
// //                                                 <Input placeholder="Course Duration" type="number" {...field} />
// //                                             </FormControl>
// //                                             <FormMessage />
// //                                         </FormItem>
// //                                     )}
// //                                 />
// //                                 <FormField
// //                                     control={form.control}
// //                                     name="price"
// //                                     render={({ field }) => (
// //                                         <FormItem className="w-full">
// //                                             <FormLabel>Course Price ($)</FormLabel>
// //                                             <FormControl>
// //                                                 <Input placeholder="Course Duration" type="number" {...field} />
// //                                             </FormControl>
// //                                             <FormMessage />
// //                                         </FormItem>
// //                                     )}
// //                                 />
// //                             </div>
// //                             <Button>
// //                                 Create Course
// //                                 <PlusIcon className="ml-1" size={16} />
// //                             </Button>
// //                         </form>
// //                     </Form>
// //                 </CardContent>
// //             </Card>
// //         </>
// //     );
// // }













// // "use client";

// // import { Button, buttonVariants } from "@/components/ui/button";
// // import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// // import { courseCategories, courseLevels, courseSchema, CourseSchemaType } from "@/lib/zodSchemas";
// // import { ArrowLeft, PlusIcon, SparkleIcon } from "lucide-react";
// // import Link from "next/link";
// // import { useForm } from "react-hook-form";
// // import { zodResolver } from "@hookform/resolvers/zod";
// // import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// // import { Input } from "@/components/ui/input";
// // import { Textarea } from "@/components/ui/textarea";
// // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// // import { RichTextEditor } from "@/components/rich-text-editor/Editor";

// // export default function CourseCreationPage() {
// //     const form = useForm<CourseSchemaType>({
// //         resolver: zodResolver(courseSchema),
// //         defaultValues: {
// //             title: "",
// //             description: "",
// //             fileKey: "",
// //             price: 1,
// //             duration: 1,
// //             level: "BEGINNER",
// //             category: "Computer Science Fundamentals",
// //             smallDescription: "",
// //             slug: "",
// //             status: "DRAFT"
// //         },
// //     });

// //     function onSubmit(values: CourseSchemaType) {
// //         console.log(values);
// //     }

// //     function slugify(titleValue: string) {
// //         return titleValue
// //             .toLowerCase()
// //             .trim()
// //             .replace(/[\s\W-]+/g, "-")
// //             .replace(/^-+|-+$/g, "");
// //     }

// //     return (
// //         <>
// //             <div className="flex items-center gap-4">
// //                 <Link
// //                     href="/admin/courses"
// //                     className={buttonVariants({
// //                         variant: "outline",
// //                         size: "icon",
// //                     })}
// //                 >
// //                     <ArrowLeft className="size-4" />
// //                 </Link>
// //                 <h1 className="text-2xl font-bold">Create Course</h1>
// //             </div>

// //             <Card>
// //                 <CardHeader>
// //                     <CardTitle>Basic Information</CardTitle>
// //                     <CardDescription>
// //                         Provide the basic information for the course you want to create.
// //                     </CardDescription>
// //                 </CardHeader>
// //                 <CardContent>
// //                     <Form {...form}>
// //                         <form
// //                             className="space-y-6"
// //                             onSubmit={form.handleSubmit(onSubmit)}
// //                         >
// //                             <FormField
// //                                 control={form.control}
// //                                 name="title"
// //                                 render={({ field }) => (
// //                                     <FormItem>
// //                                         <FormLabel>Title</FormLabel>
// //                                         <FormControl>
// //                                             <Input placeholder="Title" {...field} />
// //                                         </FormControl>
// //                                         <FormMessage />
// //                                     </FormItem>
// //                                 )}
// //                             />
// //                             <div className="flex gap-4 items-end">
// //                                 <FormField
// //                                     control={form.control}
// //                                     name="slug"
// //                                     render={({ field }) => (
// //                                         <FormItem className="w-full">
// //                                             <FormLabel>Slug</FormLabel>
// //                                             <FormControl>
// //                                                 <Input placeholder="slug" {...field} />
// //                                             </FormControl>
// //                                             <FormMessage />
// //                                         </FormItem>
// //                                     )}
// //                                 />
// //                                 <Button
// //                                     type="button"
// //                                     className="w-fit"
// //                                     onClick={() => {
// //                                         const titleValue = form.getValues("title");
// //                                         const slug = slugify(titleValue);
// //                                         form.setValue("slug", slug, { shouldValidate: true });
// //                                     }}
// //                                 >
// //                                     Generate Slug <SparkleIcon className="ml-1" size={16} />
// //                                 </Button>
// //                             </div>
// //                             <FormField
// //                                 control={form.control}
// //                                 name="smallDescription"
// //                                 render={({ field }) => (
// //                                     <FormItem className="w-full">
// //                                         <FormLabel>Small Description</FormLabel>
// //                                         <FormControl>
// //                                             <Textarea 
// //                                                 placeholder="Small description"
// //                                                 className="min-h-[120px]"
// //                                                 {...field} 
// //                                             />
// //                                         </FormControl>
// //                                         <FormMessage />
// //                                     </FormItem>
// //                                 )}
// //                             />

// //                             <FormField
// //                                 control={form.control}
// //                                 name="description"
// //                                 render={({}) => (
// //                                     <FormItem className="w-full">
// //                                         <FormLabel>Description</FormLabel>
// //                                         <FormControl>
// //                                             <RichTextEditor field={undefined} />
// //                                             {/* <Textarea 
// //                                                 placeholder="Full description"
// //                                                 className="min-h-[120px]"
// //                                                 {...field} 
// //                                             /> */}
// //                                         </FormControl>
// //                                         <FormMessage />
// //                                     </FormItem>
// //                                 )}
// //                             />
// //                             <FormField
// //                                 control={form.control}
// //                                 name="fileKey"
// //                                 render={({ field }) => (
// //                                     <FormItem className="w-full">
// //                                         <FormLabel>Thumbnail Image</FormLabel>
// //                                         <FormControl>
// //                                             <Input placeholder="thumbnail url" {...field} />
// //                                         </FormControl>
// //                                         <FormMessage />
// //                                     </FormItem>
// //                                 )}
// //                             />
// //                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                                 <FormField
// //                                     control={form.control}
// //                                     name="category"
// //                                     render={({ field }) => (
// //                                         <FormItem className="w-full">
// //                                             <FormLabel>Category</FormLabel>
// //                                             <Select onValueChange={field.onChange} defaultValue={field.value}>
// //                                                 <FormControl>
// //                                                     <SelectTrigger className="w-full">
// //                                                         <SelectValue placeholder="Select Category" />
// //                                                     </SelectTrigger>
// //                                                 </FormControl>
// //                                                 <SelectContent>
// //                                                     {courseCategories.map((category) => (
// //                                                         <SelectItem key={category} value={category}>
// //                                                             {category}
// //                                                         </SelectItem>
// //                                                     ))}
// //                                                 </SelectContent>
// //                                             </Select>
// //                                             <FormMessage />
// //                                         </FormItem>
// //                                     )}
// //                                 />
// //                                 <FormField
// //                                     control={form.control}
// //                                     name="level"
// //                                     render={({ field }) => (
// //                                         <FormItem className="w-full">
// //                                             <FormLabel>Level</FormLabel>
// //                                             <Select onValueChange={field.onChange} defaultValue={field.value}>
// //                                                 <FormControl>
// //                                                     <SelectTrigger className="w-full">
// //                                                         <SelectValue placeholder="Select Level" />
// //                                                     </SelectTrigger>
// //                                                 </FormControl>
// //                                                 <SelectContent>
// //                                                     {courseLevels.map((level) => (
// //                                                         <SelectItem key={level} value={level}>
// //                                                             {level}
// //                                                         </SelectItem>
// //                                                     ))}
// //                                                 </SelectContent>
// //                                             </Select>
// //                                             <FormMessage />
// //                                         </FormItem>
// //                                     )}
// //                                 />
// //                                 <FormField
// //                                     control={form.control}
// //                                     name="duration"
// //                                     render={({ field }) => (
// //                                         <FormItem className="w-full">
// //                                             <FormLabel>Duration (hours)</FormLabel>
// //                                             <FormControl>
// //                                                 <Input 
// //                                                     placeholder="Course Duration" 
// //                                                     type="number"
// //                                                     min="1"
// //                                                     max="500"
// //                                                     {...field}
// //                                                 />
// //                                             </FormControl>
// //                                             <FormMessage />
// //                                         </FormItem>
// //                                     )}
// //                                 />
// //                                 <FormField
// //                                     control={form.control}
// //                                     name="price"
// //                                     render={({ field }) => (
// //                                         <FormItem className="w-full">
// //                                             <FormLabel>Course Price ($)</FormLabel>
// //                                             <FormControl>
// //                                                 <Input 
// //                                                     placeholder="Course Price" 
// //                                                     type="number"
// //                                                     min="1"
// //                                                     {...field}
// //                                                 />
// //                                             </FormControl>
// //                                             <FormMessage />
// //                                         </FormItem>
// //                                     )}
// //                                 />
// //                             </div>
// //                             <Button type="submit">
// //                                 Create Course
// //                                 <PlusIcon className="ml-1" size={16} />
// //                             </Button>
// //                         </form>
// //                     </Form>
// //                 </CardContent>
// //             </Card>
// //         </>
// //     );
// // }


























"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { courseCategories, courseLevels, courseSchema, CourseSchemaType } from "@/lib/zodSchemas";
import { ArrowLeft, Loader2, PlusIcon, SparkleIcon} from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RichTextEditor } from "@/components/rich-text-editor/Editor";
// import { Uploader } from "@/components/file-uploader/Uploader";
// import { Uploader } from "@/components/file-uploader/Uploader";
import { Uploader } from "@/components/file-uploader/Uploader"
import { useTransition } from "react";
import { tryCatch } from "@/hooks/try-catch";
import { CreateCourse } from "./actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CourseCreationPage() {



    const [isPending, startTransition] = useTransition()
    const router = useRouter();
    const form = useForm<CourseSchemaType>({
        resolver: zodResolver(courseSchema),
        defaultValues: {
            title: "",
            description: "",
            fileKey: "",
            price: 1,
            duration: 1,
            level: "BEGINNER",
            category: "Computer Science Fundamentals",
            smallDescription: "",
            slug: "",
            status: "DRAFT"
        },
    });

    function onSubmit(values: CourseSchemaType) {
        // console.log(values);
        startTransition(async () => {
            const { data: result, error } = await tryCatch(CreateCourse(values));

            if (error) {
                toast.error("an unexpected error occurred")
                return;
            }

            if (result.status === 'success') {
                toast.success(result.message)
                form.reset();
                router.push("/admin/courses")
            } else if (result.status === "error") {
                toast.error(result.message);
            }
        });
    }

    function slugify(titleValue: string) {
        return titleValue
            .toLowerCase()
            .trim()
            .replace(/[\s\W-]+/g, "-")
            .replace(/^-+|-+$/g, "");
    }

    return (
        <>
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/courses"
                    className={buttonVariants({
                        variant: "outline",
                        size: "icon",
                    })}
                >
                    <ArrowLeft className="size-4" />
                </Link>
                <h1 className="text-2xl font-bold">Create Course</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>
                        Provide the basic information for the course you want to create.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            className="space-y-6"
                            onSubmit={form.handleSubmit(onSubmit)}
                        >
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Title" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex gap-4 items-end">
                                <FormField
                                    control={form.control}
                                    name="slug"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>Slug</FormLabel>
                                            <FormControl>
                                                <Input placeholder="slug" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    type="button"
                                    className="w-fit"
                                    onClick={() => {
                                        const titleValue = form.getValues("title");
                                        const slug = slugify(titleValue);
                                        form.setValue("slug", slug, { shouldValidate: true });
                                    }}
                                >
                                    Generate Slug <SparkleIcon className="ml-1" size={16} />
                                </Button>
                            </div>
                            <FormField
                                control={form.control}
                                name="smallDescription"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Small Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Small description"
                                                className="min-h-[120px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <RichTextEditor field={field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="fileKey"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Thumbnail Image</FormLabel>
                                        <FormControl>
                                            <Uploader onChange={field.onChange} value={field.value} />
                                            {/* <Input placeholder="thumbnail url" {...field} /> */}
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>Category</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select Category" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {courseCategories.map((category) => (
                                                        <SelectItem key={category} value={category}>
                                                            {category}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="level"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>Level</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select Level" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {courseLevels.map((level) => (
                                                        <SelectItem key={level} value={level}>
                                                            {level}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="duration"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>Duration (hours)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Course Duration"
                                                    type="number"
                                                    min="1"
                                                    max="500"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>Course Price ($)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Course Price"
                                                    type="number"
                                                    min="1"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? (
                                    <>
                                        Creating...
                                        <Loader2 className="animate-spin" />
                                    </>
                                ) : (
                                    <>
                                        Create Course <PlusIcon className="ml-1" size={16} />
                                    </>
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </>
    );
}






















// "use client";

// import { Button, buttonVariants } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// // import { courseCategories, courseLevels, courseSchema, CourseSchemaType, courseStatus } from "@/lib/zodSchema";
// import { ArrowLeft, Loader2, PlusIcon, SparkleIcon } from "lucide-react";
// import Link from "next/link";
// import { useForm } from "react-hook-form";
// import { Form } from "@/components/ui/form";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { RichTextEditor } from "@/components/rich-text-editor/Editor";
// import { Uploader } from "@/components/file-uploader/Uploader";
// import { useTransition } from "react";
// import { tryCatch } from "@/hooks/try-catch";
// import { CreateCourse } from "./actions";
// import { toast } from "sonner";

// export default function CourseCreationPage() {
//     const [isPending, startTransition] = useTransition();
//     const form = useForm<CourseSchemaType>({
//         resolver: zodResolver(courseSchema),
//         defaultValues: {
//             title: "",
//             description: "",
//             fileKey: "",
//             price: 0,
//             duration: 0,
//             level: "Beginner",
//             category: "Artificial Intelligence",
//             status: "Draft",
//             slug: "",
//             smallDescription: "",
//         },
//     });


    

//     function onSubmit(values: CourseSchemaType) {
//         startTransition(async () => {
//             const { data, error } = await tryCatch(CreateCourse(values));

//             if (error) {
//                 toast.error("An unexpected error occurred. Please try again.");
//                 return;
//             }

//             if (data?.status === "success") {
//                 toast.success(data.message);
//             } else if (data?.status === "error") {
//                 toast.error(data.message);
//             }
//         });
//     }

//     function slugify(titleValue: string) {
//         return titleValue
//             .toLowerCase()
//             .trim()
//             .replace(/[\s\W-]+/g, "-")
//             .replace(/^-+|-+$/g, "");
//     }

//     return (
//         <>
//             <div className="flex items-center gap-4">
//                 <Link
//                     href="/admin/course"
//                     className={buttonVariants({
//                         variant: "outline",
//                         size: "icon",
//                     })}
//                 >
//                     <ArrowLeft className="size-4" />
//                 </Link>
//                 <h1 className="text-2xl font-bold">Create Courses</h1>
//             </div>

//             <Card>
//                 <CardHeader>
//                     <CardTitle>Basic Information</CardTitle>
//                     <CardDescription>
//                         Provide basic information about the course
//                     </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                     <Form {...form}>
//                         <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
//                             <FormField
//                                 control={form.control}
//                                 name="title"
//                                 render={({ field }) => (
//                                     <FormItem>
//                                         <FormLabel>title</FormLabel>
//                                         <FormControl>
//                                             <Input placeholder="title" {...field} />
//                                         </FormControl>
//                                         <FormMessage />
//                                     </FormItem>
//                                 )}
//                             />

//                             <div className="flex gap-4 items-end">
//                                 <FormField
//                                     control={form.control}
//                                     name="slug"
//                                     render={({ field }) => (
//                                         <FormItem className="w-full">
//                                             <FormLabel>slug</FormLabel>
//                                             <FormControl>
//                                                 <Input placeholder="slug" {...field} />
//                                             </FormControl>
//                                             <FormMessage />
//                                         </FormItem>
//                                     )}
//                                 />
//                                 <Button
//                                     type="button"
//                                     className="w-fit"
//                                     onClick={() => {
//                                         const titleValue = form.getValues("title");
//                                         const slug = slugify(titleValue);
//                                         form.setValue("slug", slug, { shouldValidate: true });
//                                     }}
//                                 >
//                                     Generate Slug <SparkleIcon className="ml-1" size={16} />
//                                 </Button>
//                             </div>

//                             <FormField
//                                 control={form.control}
//                                 name="smallDescription"
//                                 render={({ field }) => (
//                                     <FormItem className="w-full">
//                                         <FormLabel>Small Description</FormLabel>
//                                         <FormControl>
//                                             <Textarea placeholder="Small Description" className="min-h-[120px]" {...field} />
//                                         </FormControl>
//                                         <FormMessage />
//                                     </FormItem>
//                                 )}
//                             />

//                             <FormField
//                                 control={form.control}
//                                 name="description"
//                                 render={({ field }) => (
//                                     <FormItem className="w-full">
//                                         <FormLabel>Description</FormLabel>
//                                         <FormControl>
//                                             <RichTextEditor field={field} />
//                                         </FormControl>
//                                         <FormMessage />
//                                     </FormItem>
//                                 )}
//                             />

//                             <FormField
//                                 control={form.control}
//                                 name="fileKey"
//                                 render={({ field }) => (
//                                     <FormItem className="w-full">
//                                         <FormLabel>fileKey</FormLabel>
//                                         <FormControl>
//                                             <Textarea placeholder="fileKey" className="min-h-[120px]" {...field} />
//                                         </FormControl>
//                                         <FormMessage />
//                                     </FormItem>
//                                 )}
//                             />

//                             <FormField
//                                 control={form.control}
//                                 name="fileKey"
//                                 render={({ field }) => (
//                                     <FormItem className="w-full">
//                                         <FormLabel>Thumbnail image</FormLabel>
//                                         <FormControl>
//                                             <Uploader onChange={field.onChange} value={field.value} />
//                                         </FormControl>
//                                         <FormMessage />
//                                     </FormItem>
//                                 )}
//                             />

//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                 <FormField
//                                     control={form.control}
//                                     name="category"
//                                     render={({ field }) => (
//                                         <FormItem className="w-full">
//                                             <FormLabel>Category</FormLabel>
//                                             <Select onValueChange={field.onChange} defaultValue={field.value}>
//                                                 <FormControl>
//                                                     <SelectTrigger className="w-full">
//                                                         <SelectValue placeholder="Select Category" />
//                                                     </SelectTrigger>
//                                                 </FormControl>
//                                                 <SelectContent>
//                                                     {courseCategories.map((category) => (
//                                                         <SelectItem key={category} value={category}>
//                                                             {category}
//                                                         </SelectItem>
//                                                     ))}
//                                                 </SelectContent>
//                                             </Select>
//                                             <FormMessage />
//                                         </FormItem>
//                                     )}
//                                 />

//                                 <FormField
//                                     control={form.control}
//                                     name="level"
//                                     render={({ field }) => (
//                                         <FormItem className="w-full">
//                                             <FormLabel>Level</FormLabel>
//                                             <Select onValueChange={field.onChange} defaultValue={field.value}>
//                                                 <FormControl>
//                                                     <SelectTrigger className="w-full">
//                                                         <SelectValue placeholder="Select value" />
//                                                     </SelectTrigger>
//                                                 </FormControl>
//                                                 <SelectContent>
//                                                     {courseLevels.map((category) => (
//                                                         <SelectItem key={category} value={category}>
//                                                             {category}
//                                                         </SelectItem>
//                                                     ))}
//                                                 </SelectContent>
//                                             </Select>
//                                             <FormMessage />
//                                         </FormItem>
//                                     )}
//                                 />

//                                 <FormField
//                                     control={form.control}
//                                     name="duration"
//                                     render={({ field }) => (
//                                         <FormItem className="w-full">
//                                             <FormLabel>Duration (hours)</FormLabel>
//                                             <FormControl>
//                                                 <Input placeholder="Course Duration" type="number" {...field} />
//                                             </FormControl>
//                                             <FormMessage />
//                                         </FormItem>
//                                     )}
//                                 />

//                                 <FormField
//                                     control={form.control}
//                                     name="price"
//                                     render={({ field }) => (
//                                         <FormItem className="w-full">
//                                             <FormLabel>Course Price ($)</FormLabel>
//                                             <FormControl>
//                                                 <Input placeholder="Course Duration" type="number" {...field} />
//                                             </FormControl>
//                                             <FormMessage />
//                                         </FormItem>
//                                     )}
//                                 />
//                             </div>

//                             <FormField
//                                 control={form.control}
//                                 name="status"
//                                 render={({ field }) => (
//                                     <FormItem className="w-full">
//                                         <FormLabel>Status</FormLabel>
//                                         <Select onValueChange={field.onChange} defaultValue={field.value}>
//                                             <FormControl>
//                                                 <SelectTrigger className="w-full">
//                                                     <SelectValue placeholder="Select Status" />
//                                                 </SelectTrigger>
//                                             </FormControl>
//                                             <SelectContent>
//                                                 {courseStatus.map((category) => (
//                                                     <SelectItem key={category} value={category}>
//                                                         {category}
//                                                     </SelectItem>
//                                                 ))}
//                                             </SelectContent>
//                                         </Select>
//                                         <FormMessage />
//                                     </FormItem>
//                                 )}
//                             />

//                             <Button type="submit" disabled={isPending}>
//                                 {/* Create Course <PlusIcon className="ml-1" size={16} /> */}
//                                 {isPending ? (
//                                     <>
//                                         Creating...

//                                         <Loader2 className="animate-spin ml-1" />
//                                     </>
//                                 ) : (
//                                     <>
//                                         Create Course <PlusIcon className="ml-1" size={16} />
//                                     </>
//                                 )}
//                             </Button>
//                         </form>
//                     </Form>
//                 </CardContent>
//             </Card>
//         </>
//     );
// }
