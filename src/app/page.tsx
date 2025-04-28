import { 
  ButtonImportParticipants, ButtonCreateTournament, ButtonGuideUser, 
  ButtonMyProfile, ButtonViewMyTournaments, ButtonConsultResults, 
  ButtonManageUsers, ButtonValidateCategories, ButtonStyles 
} from '../components/componentsPages/AccueilButton'; 

export default function Dashboard() {
  return (
    <>
      <ButtonStyles />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'center' }}>
        <ButtonImportParticipants />
        <ButtonCreateTournament />
        <ButtonGuideUser />
        <ButtonMyProfile />
        <ButtonViewMyTournaments />
        <ButtonConsultResults />
        <ButtonManageUsers />
        <ButtonValidateCategories />
      </div>
    </>
  );
}
