import { Card } from "flowbite-react";

export function About() {
    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <h1 className="text-4xl font-bold mb-8 text-center">Hakkımızda</h1>

            <div className="space-y-6">
                <Card>
                    <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Biz Kimiz?
                    </h5>
                    <p className="font-normal text-gray-700 dark:text-gray-400">
                        Rent A Car olarak, 2024 yılından bu yana müşterilerimize en kaliteli araç kiralama deneyimini sunmayı hedefliyoruz.
                        Geniş araç filomuz ve müşteri odaklı hizmet anlayışımızla sektörde öncü konumdayız.
                    </p>
                </Card>

                <Card>
                    <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Misyonumuz
                    </h5>
                    <p className="font-normal text-gray-700 dark:text-gray-400">
                        Güvenilir, konforlu ve ekonomik araç kiralama hizmeti sunarak müşterilerimizin seyahat özgürlüğüne katkıda bulunmak.
                    </p>
                </Card>

                <Card>
                    <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Vizyonumuz
                    </h5>
                    <p className="font-normal text-gray-700 dark:text-gray-400">
                        Teknolojiyi en iyi şekilde kullanarak, araç kiralama süreçlerini dijitalleştirmek ve global ölçekte tanınan bir marka olmak.
                    </p>
                </Card>
            </div>
        </div>
    );
}
