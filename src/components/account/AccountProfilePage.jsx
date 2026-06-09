import { motion } from 'framer-motion';
import AccountLayout from './AccountLayout';
import ProfileSection from './ProfileSection';

export default function AccountProfilePage() {
    return (
        <AccountLayout
            title="Mis datos"
            subtitle="Consulta los datos de empresa y la dirección asociada a tu cuenta de cliente."
        >
            {({ linkedCustomers }) => (
                <div className="grid gap-5">
                    {linkedCustomers.map((customer) => (
                        <motion.div
                            key={`${customer.empresa}-${customer.codclien}`}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ProfileSection customer={customer} />
                        </motion.div>
                    ))}
                </div>
            )}
        </AccountLayout>
    );
}