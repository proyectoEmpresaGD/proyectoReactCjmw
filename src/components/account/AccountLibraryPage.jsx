import AccountLayout from "./AccountLayout";
import LibrarySection from "./LibrarySection";


export default function AccountLibraryPage() {
    return (
        <AccountLayout
            title="Mi biblioteca"
            subtitle="Consulta los libros y perchas que forman parte de tu biblioteca profesional."
        >
            {() => (
                <LibrarySection />
            )}
        </AccountLayout>
    );
}