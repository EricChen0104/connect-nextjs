import Link from "next/link";
import Image from "next/image";

import { useRouter } from "next/navigation";

import TextareaAutosize from "react-textarea-autosize";
import { motion } from "framer-motion";
import { CldUploadButton } from "next-cloudinary";

const Form = ({ type, post, setPost, submitting, handleSubmit }) => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  // const uploadPhoto = (result) => {

  // }

  return (
    <section className="bg-white absolute w-[calc(100%-20px)] md:w-100 md:-translate-x-1/2 md:left-1/2 bottom-10 h-[calc(100%-100px)] left-2.5 shadow-2xl rounded-xl overflow-auto">
      <h1 className="text-xl font-bold p-4">
        <span className="blue_gradient">{type} Post</span>
      </h1>

      <form
        className="flex flex-col w-[calc(100%-2rem)] gap-4 ml-3 "
        onSubmit={handleSubmit}
      >
        <div className="flex justify-between items-center w-full mb-3">
          <motion.div
            onClick={handleBack}
            className="cursor-pointer"
            whileTap={{ x: 10 }}
            transition={{
              duration: 0.25,
            }}
          >
            <Image src="/assets/icons/Back icon.png" width={25} height={25} />
          </motion.div>
          <button
            type="submit"
            disabled={submitting}
            className="bg-red-400 px-4 py-1 rounded-lg text-neutral-50 text-sm shadow-md border-y border-x border-red-400 hover:bg-white hover:text-black transition-all"
          >
            {submitting ? `${type}...` : type}
          </button>
        </div>
        <label className="flex flex-col gap-4 border-t border-b w-full">
          <span className="font-semibold pt-4 w-full">Your post</span>
          <TextareaAutosize
            value={post.description}
            onChange={(e) => setPost({ ...post, description: e.target.value })}
            placeholder="Write something..."
            className="textarea mb-4 p-2 focus:outline-none resize-none"
          />
        </label>
        {/* <CldUploadButton
          options={{ maxFiles: 5 }}
          onUpload={() => {}}
          uploadPreset="jptzo811"
        >
          <p>Upload new photo</p>
        </CldUploadButton> */}
        <label className="flex flex-col gap-4 px-2 border-b">
          <span className="font-semibold pt-4">
            Tags {` `}
            <span className="font-light">(#lifestyle, #sports, #foods)</span>
          </span>
          <input
            value={post.tag}
            onChange={(e) => setPost({ ...post, tag: e.target.value })}
            placeholder="#tag"
            required
            className="form_input mb-4 p-2"
          />
        </label>
      </form>
    </section>
  );
};

export default Form;
