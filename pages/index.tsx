import LayoutWithMenu from "@/components/Layouts/LayoutWithMenu";
import {PageContainer} from "@ant-design/pro-components";





export default function Home() {
    return (
        <LayoutWithMenu>
            <PageContainer content="" breadcrumbRender={false}>
                hello world
            </PageContainer>
        </LayoutWithMenu>
    )
}
