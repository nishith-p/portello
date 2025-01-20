import UserProfilePage from "@/components/UserProfilePage/UserProfilePage"


// This would typically come from an API or database
const mockUser = {
  firstName: "John",
  lastName: "Doe",
  gender: "Male",
  aiesecEmail: "john.doe@aiesec.net",
  personalEmail: "john.doe@example.com",
  photo: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-9.png",
  lc: "AIESEC in Colombo South",
  country: "Sri Lanka",
  role: "LCVP",
  expectations: "I hope to gain valuable insights into global leadership and expand my international network.",
  additionalInfo: "I have a passion for sustainable development and youth empowerment.",
}

export default function ProfilePage() {
  return <UserProfilePage user={mockUser} />
}

