import { PuppyForm } from "@/components/admin/PuppyForm";

export default function NewPuppyPage() {
  return (
    <div>
      <h1 className="font-plush text-4xl font-extrabold">New puppy</h1>
      <div className="mt-8">
        <PuppyForm />
      </div>
    </div>
  );
}
