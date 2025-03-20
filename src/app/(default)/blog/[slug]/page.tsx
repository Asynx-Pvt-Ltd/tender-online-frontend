'use client';
import Footer from '@/components/shared/footer';
import Header from '@/components/ui/header';
import Loading from '@/components/ui/loading';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export default function Page({ params }: { params: { slug: string } }) {
	const fetchBlog = async () => {
		const res = await axios.get(
			process.env.NEXT_PUBLIC_API_ENDPOINT + `/api/blog/${params.slug}`,
		);
		return res.data;
	};

	const { data: blog, isLoading } = useQuery({
		queryKey: ['blog'],
		queryFn: fetchBlog,
	});

	if (isLoading) return <Loading />;

	return (
		<div className="">
			<Header />
			<div className="pt-24 lg:pt-36 px-4 md:px-12 lg:px-20 font-roboto">
				{/* Blog Title Section */}
				<section className="bg-white shadow-md rounded-lg p-6 mb-8">
					<div className="space-y-4">
						<h1 className="text-3xl font-bold text-gray-800 md:text-4xl">
							{blog?.title}
						</h1>
						<p className="text-sm text-gray-500">{blog[0]?.tags}</p>
						<h2 className="capitalize text-lg text-gray-600">
							Written by: <span className="font-semibold">{blog?.author}</span>
						</h2>
					</div>
				</section>

				{/* Introduction Section */}
				<section className="flex flex-col md:flex-row items-center">
					<div className="flex-1 p-6 bg-white shadow-lg rounded-lg mb-4 md:mb-0">
						<p className="text-xl font-semibold text-gray-800">Introduction</p>
						<p className="text-md mt-3 text-gray-600">{blog?.introduction}</p>
					</div>
					<div className="flex-1 px-6">
						<img
							className="rounded-lg w-full h-[300px] object-cover"
							src={blog?.featuredImage}
							alt="Blog Feature Image"
						/>
					</div>
				</section>

				{/* Blog Content Section */}
				<section className="my-8">
					<div className="mt-6 p-6 bg-white shadow-lg rounded-lg">
						<p dangerouslySetInnerHTML={{ __html: blog.description }} />
					</div>
				</section>

				{/* Conclusion Section */}
				<section className="flex flex-col md:flex-row items-start my-12">
					<div className="flex-1 p-6 bg-white shadow-lg rounded-lg mb-4 md:mb-0">
						<p className="text-xl font-semibold text-gray-800">Conclusion</p>
						<p className="text-md mt-3 text-gray-600">{blog.conclusion}</p>
					</div>
				</section>
			</div>
			<Footer />
		</div>
	);
}
