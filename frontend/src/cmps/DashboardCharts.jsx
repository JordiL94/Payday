import { Bar, Line, Pie, Scatter } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    ArcElement,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    ArcElement,
    PointElement,
    BarElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);



export function DashboardCharts({ statusCount, storiesPerGroup, groupNames, priorityNames, priorityCount, membersPerStory }) {

    const statusOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
        },
    };

    const statusLabels = ['Done', 'Ready for review', 'Working on it','Stuck', 'To do' ];
    const statusData = {
        labels: statusLabels,
        datasets: [
            {
                label: 'Statuses',
                data: statusCount,
                borderColor: 'lightblue',
                backgroundColor: [
                    'rgba(75, 255, 150, 0.7)',
                    'rgba(121, 42, 194, 0.7)',
                    'rgba(255, 159, 64, 0.7)',
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(128, 128, 128, 0.7)',]
            },
        ],
    };
    const storyPerGroupOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
        },
    }
    const storyPerGroupLabels = groupNames
    const storyPerGroupData = {
        labels: storyPerGroupLabels,
        datasets: [
            {
                label: 'Stories',
                data: storiesPerGroup,
                borderColor: 'salmon',
                backgroundColor: 'salmon',
            },
        ],

    }
    const priorityLabels = priorityNames
    const priorityData = {
        labels: priorityLabels,
        datasets: [
            {
                label: 'Priorities',
                data: priorityCount,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(255, 205, 86, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(128, 128, 128, 0.5)',
                ]
            },
        ],
    }
    const membersPerStoryOptions = {
        scales: {
            y: {
                beginAtZero: true,
            },
        }
    }

    const membersPerStoryData = {
        datasets: [
            {
                label: 'Members per story',
                //   data: Array.from({ length: 100 }, () => ({
                //     x: faker.datatype.number({ min: -100, max: 100 }),
                //     y: faker.datatype.number({ min: -100, max: 100 }),
                //   })),
                data: membersPerStory,
                backgroundColor: 'rgba(255, 99, 132, 1)',
            },
        ],
    }



    return <section>
        <div className='dash-top-container'>
            <div className="bar-chart">
                <h4>Board Statuses</h4>
                <Bar options={statusOptions} data={statusData} />
            </div>
            <div className='line-chart'>
                <h4>Stories per group</h4>
                <Line options={storyPerGroupOptions} data={storyPerGroupData} />
            </div>
        </div>
        <div className="dash-bottom-container">
            <div className='pie-chart'>
                <h4>Board Priorities</h4>
                <Pie className='pie' data={priorityData} />
            </div>
        </div>
    </section>
}





