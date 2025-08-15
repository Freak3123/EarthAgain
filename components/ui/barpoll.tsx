import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Users, Vote } from "lucide-react";
import { Label } from "./label";
import { Input } from "./input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

const districts = [
  // Northern Districts
  "Angul",
  "Balangir",
  "Bargarh",
  "Deogarh",
  "Dhenkanal",
  "Jharsuguda",
  "Kendujhar",
  "Sambalpur",
  "Subarnapur",
  "Sundargarh",
  // Coastal Districts
  "Balasore",
  "Bhadrak",
  "Cuttack",
  "Jagatsinghpur",
  "Jajpur",
  "Kendrapada",
  "Khordha",
  "Mayurbhanj",
  "Nayagarh",
  "Puri",
  // Southern Districts
  "Boudh",
  "Gajapati",
  "Ganjam",
  "Kalahandi",
  "Kandhamal",
  "Koraput",
  "Nabarangpur",
  "Rayagada",
  "Sonepur",
];
// Pass initialVotes as prop
const BarPoll = ({ initialVotes }) => {
  const [votes, setVotes] = useState(initialVotes);

  return (
    <section className=" px-4 py-12">
      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-2 md:grid-cols-[1fr_400px] md:gap-12">
        <Options votes={votes} setVotes={setVotes} />
        <Bars votes={votes} />
      </div>
    </section>
  );
};

const Options = ({ votes, setVotes }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  type FormData = {
    name: string;
    email: string;
    mobile: string;
    district: string;
    votes: string[];
  };

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    mobile: "",
    district: "",
    votes: [],
  });
  const [selectedVotes, setSelectedVotes] = useState<string[]>([]);
  const totalVotes = votes.reduce((acc, cv) => acc + cv.votes, 0);

  const handleIncrementVote = (vote) => {
    const newVote = { ...vote, votes: vote.votes + 1 };
    //add vote in selectedVotes only if it does not already exist in selectedVotes
    if (!selectedVotes.includes(newVote.issue)) {
      setSelectedVotes((prev) => [...prev, newVote.issue]);
      setFormData((prev) => ({
        ...prev,
        votes: [...prev.votes, newVote.issue],
      }));
    } else {
      // If already selected, remove it
      setSelectedVotes((prev) => prev.filter((v) => v !== newVote.issue));
      setFormData((prev) => ({
        ...prev,
        votes: prev.votes.filter((v) => v !== newVote.issue),
      }));
    }

    // setVotes((pv) => pv.map((v) => (v.title === newVote.title ? newVote : v)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };
  return (
    <div className="col-span-1 py-12">
      <h3 className="mb-6 text-3xl font-semibold text-slate-50">
        What&apos;s your opinion?
      </h3>
      <div className="text-white pb-5">You can select maximum of 5 votes*</div>
      <div className="mb-6 space-y-2">
        {votes.map((vote) => (
          <motion.button
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
            onClick={() => handleIncrementVote(vote)}
            key={vote.issue}
            className={`flex w-full items-center justify-between rounded-lg  px-4 py-3 text-left transition-all ${
              selectedVotes.includes(vote.issue)
                ? `border-green-500 ${vote.color} text-white border-r-[70] border-4 rounded-br-full rounded-tr-full rounded-tl-2xl`
                : ` ${vote.color} text-white `
            }`}
            disabled={
              selectedVotes.length >= 5 && !selectedVotes.includes(vote.issue)
            }
          >
            {vote.issue}
          </motion.button>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <span className="italic text-slate-400">{totalVotes} votes</span>
        <Dialog>
          <form>
            <DialogTrigger className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md">
              {" "}
              Submit your vote
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Enter Your Details</DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-600" />
                    Personal Information
                  </h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="mobile">Mobile Number *</Label>
                      <Input
                        id="mobile"
                        value={formData.mobile}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            mobile: e.target.value,
                          }))
                        }
                        placeholder="+91 XXXXX XXXXX"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="district">District (of Odisha) *</Label>
                      <Select
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, district: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your district" />
                        </SelectTrigger>
                        <SelectContent>
                          {districts.map((district) => (
                            <SelectItem
                              key={district}
                              value={district.toLowerCase()}
                            >
                              {district}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Environmental Issues Selection */}
                {/* <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-orange-600" />
                          Issues (select up to 5)
                        </h3>
                        <Badge className="bg-blue-100 text-blue-800">
                          {formData.issues.length}/5 selected
                        </Badge>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        {environmentalIssues.map((issue) => {
                          const isSelected = formData.issues.includes(issue.id)
                          const isDisabled = !isSelected && formData.issues.length >= 5

                          return (
                            <Card 
                              key={issue.id} 
                              className={`border-2 transition-all cursor-pointer ${
                                isSelected 
                                  ? 'border-green-500 bg-green-50' 
                                  : isDisabled 
                                    ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                                    : 'border-gray-200 hover:border-green-300'
                              }`}
                            >
                              <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                  <Checkbox
                                    id={issue.id}
                                    checked={isSelected}
                                    onCheckedChange={(checked) => {
                                      if (!isDisabled) {
                                        handleIssueChange(issue.id, checked as boolean)
                                      }
                                    }}
                                    disabled={isDisabled}
                                  />
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                      <issue.icon className={`w-6 h-6 ${issue.color}`} />
                                      <div>
                                        <h4 className="font-semibold text-gray-900">{issue.odia}</h4>
                                        <p className="text-sm text-gray-600">({issue.english})</p>
                                      </div>
                                    </div>
                                    <p className="text-sm text-gray-600">{issue.description}</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )
                        })}
                      </div>

                      {formData.issues.length > 0 && (
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-2">Selected Issues:</h4>
                          <div className="flex flex-wrap gap-2">
                            {formData.issues.map((issueId) => {
                              const issue = getIssueDetails(issueId)
                              return issue ? (
                                <Badge key={issueId} className="bg-green-600 text-white">
                                  {issue.english}
                                </Badge>
                              ) : null
                            })}
                          </div>
                        </div>
                      )}
                    </div> */}

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={isSubmitted}
                >
                  <Vote className="w-5 h-5 mr-2" />
                  Submit Your Vote
                </Button>
              </form>
            </DialogContent>
          </form>
        </Dialog>
      </div>
    </div>
  );
};

const Bars = ({ votes }) => {
  const totalVotes = votes.reduce((acc, cv) => acc + cv.votes, 0);

  return (
    <div
      className="col-span-1 grid min-h-[200px] gap-2"
      style={{
        gridTemplateColumns: `repeat(${votes.length}, minmax(0, 1fr))`,
      }}
    >
      {votes.map((vote) => {
        const height = vote.votes
          ? ((vote.votes / totalVotes) * 100).toFixed(2)
          : 0;
        return (
          <div key={vote.issue} className="col-span-1">
            <div className="relative flex h-full w-full items-end overflow-hidden rounded-2xl bg-gradient-to-b from-slate-700 to-slate-800">
              <motion.span
                animate={{ height: `${height}%` }}
                className={`relative z-0 w-full ${vote.color}`}
                transition={{ type: "spring" }}
              />
              <span className="absolute bottom-0 left-[50%] mt-2 inline-block w-full -translate-x-[50%] p-2 text-center text-sm text-slate-50">
                
                <br />
                <span className="text-xs text-slate-200">
                  {vote.votes} votes
                </span>
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BarPoll;
