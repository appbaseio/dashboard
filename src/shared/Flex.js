import styled, { css } from 'react-emotion';

const Flex = styled.div`
	display: flex;
	flex-direction: ${({ flexDirection }) => flexDirection || 'row'};
	${({ alignItems }) =>
		alignItems &&
		css`
			align-items: ${alignItems};
		`};
	${({ justifyContent }) =>
		justifyContent &&
		css`
			justify-content: ${justifyContent};
		`};
`;

export default Flex;
