import { render } from '@testing-library/react';
import DataCard, { DataCardProps } from './DataCard';

interface TestData {
    title: string;
    content: string;
}

describe('DataCard', () => {
    const renderContent = (data: TestData): React.ReactNode => {
        return <div>{data.content}</div>;
    };

    const renderDataCard = (props: Partial<DataCardProps<TestData>> = {}) => {
        const defaultProps: DataCardProps<TestData> = {
            data: {
                title: 'Test Title',
                content: 'Test Content',
            },
            titleKey: 'title',
            renderContent,
            ...props,
        };

        return render(<DataCard<TestData> {...defaultProps} />);
    };

    test('renders the component with given props', () => {
        const { getByText } = renderDataCard();

        expect(getByText('Test Title')).toBeInTheDocument();
        expect(getByText('Test Content')).toBeInTheDocument();
    });

    test('calls renderContent with provided data', () => {
        const renderContentSpy = jest.fn(renderContent);
        renderDataCard({ renderContent: renderContentSpy });

        expect(renderContentSpy).toHaveBeenCalledWith({
            title: 'Test Title',
            content: 'Test Content',
        });
    });
});
