import React from "react";
import { Button } from "../ui/button";
import { Users, TreePine } from "lucide-react";
import Link from "next/link";

export default function CallAction() {
  return (
    <div>
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of Odisha citizens in creating a sustainable future.
            Every action counts, every voice matters.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* <Link href="/join-us">
              <Button
                size="lg"
                className="bg-white text-green-600 hover:bg-gray-100"
              >
                <Users className="w-5 h-5 mr-2" />
                Join as Volunteer
              </Button>
            </Link> */}
            <Link href="/register">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 bg-transparent"
              >
                <TreePine className="w-5 h-5 mr-2" />
                {/* Become a Partner */}
                Register for our Conference
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
